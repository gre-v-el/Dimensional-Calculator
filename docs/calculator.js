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
        if (found) {
            found.p += u.p;
        }
        else {
            merged.push(u);
        }
    };
    for (var _d = 0, units_1 = units; _d < units_1.length; _d++) {
        var u = units_1[_d];
        _loop_1(u);
    }
    // split prefixes
    for (var i = 0; i < merged.length; i++) {
        var u = merged[i];
        if (!is_basic_unit(u.v)) {
            for (var _e = 0, _f = UNITS.prefixes; _e < _f.length; _e++) {
                var p = _f[_e];
                if (u.v.startsWith(p.symbol)) {
                    var candidate = u.v.substring(p.symbol.length);
                    if (is_basic_unit(candidate)) {
                        merged[i] = { v: candidate, p: u.p };
                        mult *= Math.pow(10, (p.exponent * u.p));
                    }
                }
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
    for (var _g = 0, merged_1 = merged; _g < merged_1.length; _g++) {
        var u = merged_1[_g];
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
            if (mult) {
                unit = multiply(unit, best);
                var found = unit.compounds.find(function (c) { return c.name == best.symbol; });
                unit.multiplier *= best.multiplier;
                if (found) {
                    found.power -= 1;
                }
                else {
                    unit.compounds.push({ name: best.symbol, power: -1 });
                }
            }
            else {
                unit = divide(unit, best);
                var found = unit.compounds.find(function (c) { return c.name == best.symbol; });
                unit.multiplier /= best.multiplier;
                if (found) {
                    found.power += 1;
                }
                else {
                    unit.compounds.push({ name: best.symbol, power: 1 });
                }
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
