"use strict";
var MathNS = "http://www.w3.org/1998/Math/MathML";
var createMathElement = function (tag) { return document.createElementNS(MathNS, tag); };
function render_fraction(fraction_data, output, error) {
    var math = createMathElement("math");
    math.setAttribute("display", "block");
    var numerator = createMathElement("mrow");
    populate_mrow(numerator, fraction_data.numerator);
    if (fraction_data.denumerator.length > 0) {
        var frac = createMathElement("mfrac");
        var denumenator = createMathElement("mrow");
        populate_mrow(denumenator, fraction_data.denumerator);
        frac.appendChild(numerator);
        frac.appendChild(denumenator);
        math.appendChild(frac);
    }
    else {
        math.appendChild(numerator);
    }
    output.innerHTML = "";
    output.appendChild(math);
    error.textContent = fraction_data.error;
}
function is_basic_unit(u) {
    if (UNITS.SI.includes(u)) {
        return true;
    }
    else if (UNITS.derived.some(function (d) { return d.symbol == u; })) {
        return true;
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
            if (u.value == "") {
                f.error = "Empty value";
                u.error = true;
                return;
            }
            if (u.power == "") {
                f.error = "Empty power";
                u.error = true;
                return;
            }
            if (isNaN(Number(u.power))) {
                f.error = "Power is not a number";
                u.error = true;
                return;
            }
        }
    }
    for (var _c = 0, _d = [f.numerator, f.denumerator]; _c < _d.length; _c++) {
        var a = _d[_c];
        for (var _e = 0, a_2 = a; _e < a_2.length; _e++) {
            var u = a_2[_e];
            var ok = false;
            if (is_basic_unit(u.value)) {
                ok = true;
            }
            else {
                for (var _f = 0, _g = UNITS.prefixes; _f < _g.length; _f++) {
                    var p = _g[_f];
                    if (u.value.startsWith(p.symbol)) {
                        var candidate = u.value.substring(p.symbol.length);
                        if (is_basic_unit(candidate)) {
                            ok = true;
                        }
                    }
                }
            }
            if (!ok) {
                u.error = true;
                f.error = "I don't know these units";
            }
        }
    }
}
function parse_to_fraction(input) {
    var breaks = [" ", "*", "/", "^"];
    var f = {
        numerator: [],
        denumerator: [],
        error: "",
    };
    var current = f.numerator;
    var in_pow = false;
    input.trim();
    input = input.split(/(\s+)/).join(" ");
    input += " ";
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
            if (current == f.denumerator)
                f.error = "Use only a single '/'";
            current = f.denumerator;
        }
        if (char == "^") {
            in_pow = true;
        }
    }
    return f;
}
function populate_mrow(mrow, units) {
    for (var i = 0; i < units.length; i++) {
        var u = units[i];
        if (mrow.children.length > 0) {
            var multiplied = createMathElement("mo");
            multiplied.textContent = "·";
            mrow.appendChild(multiplied);
        }
        if (u.power == "1") {
            var unit = createMathElement("mi");
            unit.textContent = u.value;
            if (u.error)
                unit.setAttribute("style", "color: red;");
            mrow.appendChild(unit);
        }
        else {
            var unit = createMathElement("msup");
            var base = createMathElement("mi");
            base.textContent = u.value;
            var power = createMathElement("mn");
            power.textContent = u.power;
            unit.appendChild(base);
            unit.appendChild(power);
            if (u.error)
                unit.setAttribute("style", "color: red;");
            mrow.appendChild(unit);
        }
    }
}
