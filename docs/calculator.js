"use strict";
function fract_to_unit(fract) {
    var mult = 1;
    var units = [];
    for (var _i = 0, _a = fract.numerator; _i < _a.length; _i++) {
        var u_1 = _a[_i];
        if (!isNaN(Number(u_1.value))) {
            mult *= Math.pow(Number(u_1.value), Number(u_1.power));
        }
        units.push({ v: u_1.value, p: Number(u_1.power) });
    }
    for (var _b = 0, _c = fract.denumerator; _b < _c.length; _b++) {
        var u_2 = _c[_b];
        if (!isNaN(Number(u_2.value))) {
            mult /= Math.pow(Number(u_2.value), Number(u_2.power));
        }
        units.push({ v: u_2.value, p: -Number(u_2.power) });
    }
    // merge like units
    var merged = [];
    var _loop_1 = function (u_3) {
        var found = merged.find(function (m) { return m.v == u_3.v; });
        if (found)
            found.p += u_3.p;
        else
            merged.push(u_3);
    };
    for (var _d = 0, units_1 = units; _d < units_1.length; _d++) {
        var u_3 = units_1[_d];
        _loop_1(u_3);
    }
    // split prefixes
    for (var _e = 0, merged_1 = merged; _e < merged_1.length; _e++) {
        var u_4 = merged_1[_e];
        if (is_basic_unit(u_4.v))
            continue;
        for (var _f = 0, _g = UNITS.prefixes; _f < _g.length; _f++) {
            var p = _g[_f];
            if (!u_4.v.startsWith(p.symbol))
                continue;
            var candidate = u_4.v.substring(p.symbol.length);
            if (is_basic_unit(candidate)) {
                u_4.v = candidate;
                mult *= Math.pow(10, (p.exponent * u_4.p));
            }
        }
    }
    // collect into a unit
    var u = {
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
    for (var _h = 0, merged_2 = merged; _h < merged_2.length; _h++) {
        var m = merged_2[_h];
        var found = UNITS.SI.includes(m.v);
        // @ts-ignore
        if (found)
            u.definition[m.v] += m.p;
        else
            u.compounds.push({ name: m.v, power: m.p });
    }
    return u;
}
function expand_si(u) {
    var _loop_2 = function (c) {
        var derived = UNITS.derived.find(function (d) { return d.symbol == c.name; });
        if (derived) {
            for (var k in derived.definition) {
                // @ts-ignore
                u.definition[k] += derived.definition[k] * c.power;
            }
        }
    };
    for (var _i = 0, _a = u.compounds; _i < _a.length; _i++) {
        var c = _a[_i];
        _loop_2(c);
    }
    u.compounds = [];
}
function single_heuristic(n) {
    n = Math.abs(n);
    return n >= 1 || n == 0 ? n : 1 / n;
}
function heuristic(unit) {
    var sum = 0;
    for (var k in unit.definition) {
        // @ts-ignore 
        sum += single_heuristic(unit.definition[k]);
    }
    for (var _i = 0, _a = unit.compounds; _i < _a.length; _i++) {
        var c = _a[_i];
        sum += single_heuristic(c.power);
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
        var best;
        var best_unit = void 0;
        var mult = true;
        var best_dist = heuristic(unit);
        for (var _i = 0, _a = UNITS.derived; _i < _a.length; _i++) {
            var compound = _a[_i];
            var d = divide(unit, compound);
            var m = multiply(unit, compound);
            var hd = heuristic(d);
            var hm = heuristic(m);
            if (hd < best_dist) {
                best = compound;
                best_unit = d;
                best_dist = hd;
                mult = false;
            }
            if (hm < best_dist) {
                best = compound;
                best_unit = m;
                best_dist = hm;
                mult = true;
            }
        }
        if (best) {
            unit = best_unit;
            var found = unit.compounds.find(function (c) { return c.name == best.symbol; });
            if (found)
                found.power += mult ? -1 : 1;
            else
                unit.compounds.push({ name: best.symbol, power: mult ? -1 : 1 });
        }
        else {
            return "break";
        }
    };
    while (true) {
        var state_1 = _loop_3();
        if (state_1 === "break")
            break;
    }
    return unit;
}
function si_to_cs(si, multiplier) {
    // change the multiplier according to the conversion factors between si and cs
    multiplier /= Math.pow((Math.PI * (2 - Math.SQRT2)), si.sr);
    multiplier *= Math.pow(6.02214076e-21, si.mol);
    multiplier /= Math.pow((2 * Math.PI), si.rad);
    var unit = {
        multiplier: multiplier,
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
        compounds: [
            // the following four require solving a system of four equations
            {
                name: "c",
                power: si.m - si.kg
            },
            {
                name: "cal",
                power: si.kg / 2
            },
            {
                name: "C4",
                power: si.m - si.s - 2 * si.kg - si.A
            },
            {
                name: "C",
                power: si.A
            },
            // these are trivial
            {
                name: "deg_C",
                power: si.K
            },
            {
                name: "cd",
                power: si.cd
            },
            {
                name: "con",
                power: si.sr
            },
            {
                name: "cent",
                power: si.mol
            },
            {
                name: "cir",
                power: si.rad
            }
        ],
    };
    unit.compounds = unit.compounds.filter(function (c) { return c.power != 0; });
    return unit;
}
// kg*m H T ohm / s^2 C C F
// kg5 m7 s-15 A-9
// kg ohm / m A F^3
