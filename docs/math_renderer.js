"use strict";
var MathNS = "http://www.w3.org/1998/Math/MathML";
var createMathElement = function (tag) { return document.createElementNS(MathNS, tag); };
function render_math(input, output) {
    var fraction_data = parse_to_fraction(input);
    var math = createMathElement("math");
    math.setAttribute("display", "block");
    var frac = createMathElement("mfrac");
    var numerator = createMathElement("mrow");
    var denumenator = createMathElement("mrow");
    populate_mrow(numerator, fraction_data.numerator);
    populate_mrow(denumenator, fraction_data.denumerator);
    frac.appendChild(numerator);
    frac.appendChild(denumenator);
    math.appendChild(frac);
    output.innerHTML = "";
    output.appendChild(math);
}
// kg *m/s^2
function parse_to_fraction(input) {
    var breaks = [" ", "*", "/", "^"];
    var num = [];
    var denum = [];
    var in_nom = true;
    var in_pow = false;
    var error = "";
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
        if (buf_start == -1)
            continue;
        var unit = input.substring(buf_start, i);
        buf_start = -1;
        if (in_pow) {
            in_pow = false;
            unit = "pow:" + unit;
        }
        if (in_nom)
            num.push(unit);
        else
            denum.push(unit);
        if (char == "/") {
            if (in_nom)
                in_nom = false;
            else
                error = "Use only a single '/'";
        }
        if (char == "^") {
            in_pow = true;
        }
    }
    return {
        numerator: num,
        denumerator: denum,
        error: error,
    };
}
function populate_mrow(mrow, units) {
    for (var i = 0; i < units.length; i++) {
        var u = units[i];
        if (mrow.children.length > 0) {
            var multiplied = createMathElement("mo");
            multiplied.textContent = "·";
            mrow.appendChild(multiplied);
        }
        var unit = createMathElement("ms");
        unit.textContent = u;
        mrow.appendChild(unit);
    }
}
