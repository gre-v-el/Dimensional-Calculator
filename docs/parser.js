"use strict";
function is_basic_unit(u) {
    return UNITS.SI.some(function (s) { return s.symbol == u; }) ||
        UNITS.derived.some(function (d) { return d.symbol == u; });
}
function is_unit_good(u) {
    if (is_basic_unit(u) || !isNaN(Number(u)))
        return true;
    for (var _i = 0, _a = UNITS.prefixes; _i < _a.length; _i++) {
        var p = _a[_i];
        if (u.startsWith(p.symbol)) {
            var candidate = u.substring(p.symbol.length);
            if (is_basic_unit(candidate)) {
                return true;
            }
        }
    }
    return false;
}
function validate_fraction(f) {
    if (f.numerator.length == 0) {
        f.numerator.push({
            value: "1",
            power: "1",
            error: false,
        });
    }
    for (var _i = 0, _a = [f.numerator, f.denumerator]; _i < _a.length; _i++) {
        var a = _a[_i];
        for (var _b = 0, a_1 = a; _b < a_1.length; _b++) {
            var u = a_1[_b];
            if (isNaN(Number(u.power))) {
                f.error = "Exponent is not a number";
                u.error = true;
            }
        }
    }
    if (f.error.length > 0)
        return;
    for (var _c = 0, _d = [f.numerator, f.denumerator]; _c < _d.length; _c++) {
        var a = _d[_c];
        for (var _e = 0, a_2 = a; _e < a_2.length; _e++) {
            var u = a_2[_e];
            if (!is_unit_good(u.value)) {
                u.error = true;
                f.error = "I don't know these units (" + u.value + ")";
            }
        }
    }
}
function parse_to_fraction(input) {
    input = input.trim();
    input = input.split(/(\s+)/).join(" ");
    input += " ";
    var breaks = [" ", "*", "/", "^"];
    var f = {
        numerator: [],
        denumerator: [],
        error: "",
        hard_error: false,
    };
    var current = f.numerator;
    var in_pow = false;
    var buf_start = 0;
    for (var i = 0; i < input.length; i++) {
        var char = input.charAt(i);
        if (!breaks.includes(char)) {
            if (buf_start == -1)
                buf_start = i;
            continue;
        }
        if (buf_start != -1 && i > buf_start) {
            var item = input.substring(buf_start, i);
            buf_start = -1;
            if (item == "Ohm" || item == "ohm")
                item = "Ω";
            if (in_pow) {
                in_pow = false;
                if (current.length == 0) {
                    f.error = "Invalid use of '^'";
                    continue;
                }
                current[current.length - 1].power = item;
            }
            else {
                current.push({
                    value: item,
                    power: "1",
                    error: false,
                });
            }
        }
        if (char == "/") {
            if (i == 0) {
                f.error = "Put something before the '/', for example a '1'.";
                f.hard_error = true;
                return f;
            }
            if (current == f.denumerator) {
                f.error = "Use only a single '/'";
                f.hard_error = true;
                return f;
            }
            current = f.denumerator;
        }
        if (char == "^") {
            if (in_pow) {
                f.error = "Invalid use of '^'";
            }
            in_pow = true;
        }
    }
    return f;
}
