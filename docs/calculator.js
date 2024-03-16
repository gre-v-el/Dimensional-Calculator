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
        else if (c.name == "g") {
            u.definition.kg += c.power;
            u.multiplier *= Math.pow(0.001, c.power);
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
    // if(n >= 1) return 1 + (n-1) * 0.1;
    // return n==0? 0 : 1/n;
    return n == 0 ? 0 : (Math.max(n, 1 / n));
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
function extract(u1, u2, times) {
    var result = {
        multiplier: u1.multiplier,
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
        result.definition[k] = u1.definition[k] - times * u2.definition[k];
    }
    var found = result.compounds.find(function (c) { return c.name == u2.symbol; });
    if (found)
        found.power += times;
    else
        result.compounds.push({ name: u2.symbol, power: times });
    return result;
}
function reduce_unit_greedy(unit) {
    while (true) {
        var best_unit = void 0;
        var best_dist = heuristic(unit);
        for (var _i = 0, _a = UNITS.derived; _i < _a.length; _i++) {
            var compound = _a[_i];
            var d = extract(unit, compound, 1);
            var m = extract(unit, compound, -1);
            var hd = heuristic(d);
            var hm = heuristic(m);
            if (hd < best_dist) {
                best_unit = d;
                best_dist = hd;
            }
            if (hm < best_dist) {
                best_unit = m;
                best_dist = hm;
            }
        }
        if (best_unit)
            unit = best_unit;
        else
            break;
    }
    return unit;
}
function si_to_cs(si, multiplier) {
    // in fact these are powers of the respective SI units like m/s and joules
    var c = si.m - 2 * si.kg;
    var cal = si.kg;
    var C4 = -si.m - si.s + si.A;
    var C = si.A;
    var deg_C = si.K;
    var cd = si.cd;
    var con = si.sr;
    var cent = si.mol;
    var cir = si.rad;
    // change the multiplier according to the conversion factors between si and cs
    // 1 sr = PI(2 - sqrt(2)) con
    multiplier *= Math.pow((Math.PI * (2 - Math.SQRT2)), si.sr);
    // 1 mol = (N_A)/100 cent
    multiplier *= Math.pow(6.02214076e21, si.mol);
    // 1 rad = (1/2PI) cir
    multiplier /= Math.pow((2 * Math.PI), si.rad);
    // 1 m/s = 1/299792458 c
    multiplier /= Math.pow(299792458, c);
    // 1 J = 1/4.184 cal
    multiplier /= Math.pow(4.184, cal);
    // 1 Hz = 1/261.62556530059863467785 C4
    multiplier /= Math.pow(261.62556530059863467785, C4);
    var unit = {
        multiplier: multiplier,
        definition: {
            kg: 0, m: 0, s: 0, A: 0, K: 0,
            mol: 0, cd: 0, rad: 0, sr: 0,
        },
        compounds: [
            { name: "c", power: c },
            { name: "cal", power: cal },
            { name: "C₄", power: C4 },
            { name: "C", power: C },
            { name: "°C", power: deg_C },
            { name: "cd", power: cd },
            { name: "con", power: con },
            { name: "cent", power: cent },
            { name: "cir", power: cir },
        ],
    };
    unit.compounds = unit.compounds.filter(function (c) { return c.power != 0; });
    return unit;
}
// kg*m H T ohm / s^2 C C F
// kg5 m7 s-15 A-9
// kg ohm / m A F^3
