"use strict";
var MathNS = "http://www.w3.org/1998/Math/MathML";
var createMathElement = function (tag) { return document.createElementNS(MathNS, tag); };
function render_fraction(fraction_data, output, error) {
    output.innerHTML = "";
    error.textContent = fraction_data.error;
    if (fraction_data.hard_error)
        return;
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
    output.appendChild(math);
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
