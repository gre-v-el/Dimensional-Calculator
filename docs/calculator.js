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
    // change combined units to SI units
    var si_units = {
        multiplier: mult,
        kg: 0,
        m: 0,
        s: 0,
        A: 0,
        K: 0,
        mol: 0,
        cd: 0,
        rad: 0,
        sr: 0,
        compounds: [],
    };
    var _loop_2 = function (u) {
        var found = UNITS.SI.find(function (s) { return s.symbol == u.v; });
        if (found) {
            // @ts-ignore
            si_units[found.symbol] += u.p;
        }
        else {
            var derived = UNITS.derived.find(function (d) { return d.symbol == u.v; });
            if (derived) {
                for (var k in derived.definition) {
                    // @ts-ignore
                    si_units[k] += derived.definition[k] * u.p;
                }
            }
        }
    };
    for (var _e = 0, merged_1 = merged; _e < merged_1.length; _e++) {
        var u = merged_1[_e];
        _loop_2(u);
    }
    return si_units;
}
