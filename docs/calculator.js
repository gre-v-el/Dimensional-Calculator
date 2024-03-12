"use strict";
function fract_to_si_unit(fract) {
    var mult = 1;
    var units = [];
    for (var _i = 0, _a = fract.numerator; _i < _a.length; _i++) {
        var u = _a[_i];
        if (!isNaN(Number(u.value))) {
            mult *= Math.pow(Number(u.value), Number(u.power));
        }
        units.push({ v: u.value, p: Number(u.power) });
    }
    for (var _b = 0, _c = fract.denumerator; _b < _c.length; _b++) {
        var u = _c[_b];
        if (!isNaN(Number(u.value))) {
            mult /= Math.pow(Number(u.value), Number(u.power));
        }
        units.push({ v: u.value, p: -Number(u.power) });
    }
    // merge like units
    var merged = [];
    var _loop_1 = function (u) {
        var found = merged.find(function (m) { return m.v == u.v; });
        if (found)
            found.p += u.p;
        else
            merged.push(u);
    };
    for (var _d = 0, units_1 = units; _d < units_1.length; _d++) {
        var u = units_1[_d];
        _loop_1(u);
    }
    // split prefixes
    for (var _e = 0, merged_1 = merged; _e < merged_1.length; _e++) {
        var u = merged_1[_e];
        if (is_basic_unit(u.v))
            continue;
        for (var _f = 0, _g = UNITS.prefixes; _f < _g.length; _f++) {
            var p = _g[_f];
            if (!u.v.startsWith(p.symbol))
                continue;
            var candidate = u.v.substring(p.symbol.length);
            if (is_basic_unit(candidate)) {
                u.v = candidate;
                mult *= Math.pow(10, (p.exponent * u.p));
            }
        }
    }
    // change combined units to SI units
    var si_units = {
        multiplier: mult,
        definition: {
            kg: 0,
            m: 0,
            s: 0,
            A: 0,
            K: 0,
            mol: 0,
            cd: 0,
            rad: 0,
            sr: 0,
        },
        compounds: [],
    };
    var _loop_2 = function (u) {
        var found = UNITS.SI.find(function (s) { return s.symbol == u.v; });
        if (found) {
            // @ts-ignore
            si_units.definition[found.symbol] += u.p;
        }
        else {
            var derived = UNITS.derived.find(function (d) { return d.symbol == u.v; });
            if (derived) {
                for (var k in derived.definition) {
                    // @ts-ignore
                    si_units.definition[k] += derived.definition[k] * u.p;
                }
            }
        }
    };
    for (var _h = 0, merged_2 = merged; _h < merged_2.length; _h++) {
        var u = merged_2[_h];
        _loop_2(u);
    }
    return si_units;
}
function heuristic(unit) {
    var sum = 0;
    for (var k in unit.definition) {
        // @ts-ignore
        sum += Math.abs(unit.definition[k]);
    }
    for (var _i = 0, _a = unit.compounds; _i < _a.length; _i++) {
        var c = _a[_i];
        sum += Math.abs(c.power);
    }
    return sum;
}
function divide(u1, u2) {
    var result = {
        multiplier: u1.multiplier / u2.multiplier,
        definition: {
            kg: 0,
            m: 0,
            s: 0,
            A: 0,
            K: 0,
            mol: 0,
            cd: 0,
            rad: 0,
            sr: 0,
        },
        compounds: u1.compounds.slice(),
    };
    for (var k in u1.definition) {
        // @ts-ignore
        result.definition[k] = u1.definition[k] - u2.definition[k];
    }
    return result;
}
function multiply(u1, u2) {
    var result = {
        multiplier: u1.multiplier * u2.multiplier,
        definition: {
            kg: 0,
            m: 0,
            s: 0,
            A: 0,
            K: 0,
            mol: 0,
            cd: 0,
            rad: 0,
            sr: 0,
        },
        compounds: u1.compounds.slice(),
    };
    for (var k in u1.definition) {
        // @ts-ignore
        result.definition[k] = u1.definition[k] + u2.definition[k];
    }
    return result;
}
function reduce_unit(unit) {
    var _loop_3 = function () {
        var improved = false;
        var best;
        var mult = true;
        var best_dist = heuristic(unit);
        for (var _i = 0, _a = UNITS.derived; _i < _a.length; _i++) {
            var compound = _a[_i];
            var d = divide(unit, compound);
            var m = multiply(unit, compound);
            if (heuristic(d) < best_dist) {
                best = compound;
                best_dist = heuristic(d);
                mult = false;
            }
            if (heuristic(m) < best_dist) {
                best = compound;
                best_dist = heuristic(m);
                mult = true;
            }
        }
        if (best) {
            improved = true;
            unit = mult ? multiply(unit, best) : divide(unit, best);
            var found = unit.compounds.find(function (c) { return c.name == best.symbol; });
            unit.multiplier = mult ? unit.multiplier * best.multiplier : unit.multiplier / best.multiplier;
            if (found) {
                found.power += mult ? -1 : 1;
            }
            else {
                unit.compounds.push({ name: best.symbol, power: mult ? -1 : 1 });
            }
        }
        if (!improved)
            return "break";
    };
    while (true) {
        var state_1 = _loop_3();
        if (state_1 === "break")
            break;
    }
    return unit;
}
// kg*m H T ohm / s^2 C C F
// kg5 m7 s-15 A-9
// kg ohm / m A F^3
