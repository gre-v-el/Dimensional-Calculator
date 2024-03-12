"use strict";
var MathNS = "http://www.w3.org/1998/Math/MathML";
var createMathElement = function (tag) { return document.createElementNS(MathNS, tag); };
var createMathElementContent = function (tag, content) {
    var e = document.createElementNS(MathNS, tag);
    e.textContent = content;
    return e;
};
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
// TODO: should construct a Fraction and call render_fraction()
function render_unit(v, output) {
    output.innerHTML = "";
    var math = createMathElement("math");
    math.setAttribute("display", "block");
    var mrow = createMathElement("mrow");
    math.appendChild(mrow);
    if (v.multiplier != 1) {
        mrow.appendChild(createMathElementContent("mn", v.multiplier.toString()));
        mrow.appendChild(createMathElementContent("mo", "·"));
    }
    var numerator = createMathElement("mrow");
    var denumerator = createMathElement("mrow");
    for (var _i = 0, _a = v.compounds; _i < _a.length; _i++) {
        var c = _a[_i];
        var item = void 0;
        if (c.power == 1 || c.power == -1) {
            item = createMathElementContent("mi", c.name);
        }
        else {
            item = createMathElement("msup");
            var unit = createMathElementContent("mi", c.name);
            var power = createMathElementContent("mn", Math.abs(c.power).toString());
            item.appendChild(unit);
            item.appendChild(power);
        }
        if (c.power > 0) {
            if (numerator.hasChildNodes()) {
                numerator.appendChild(createMathElementContent("mo", "·"));
            }
            numerator.appendChild(item);
        }
        else {
            if (denumerator.hasChildNodes()) {
                denumerator.appendChild(createMathElementContent("mo", "·"));
            }
            denumerator.appendChild(item);
        }
    }
    for (var k in v.definition) {
        // @ts-ignore
        var value = v.definition[k];
        if (value == 0)
            continue;
        var item = void 0;
        var unit = createMathElementContent("mi", k);
        if (value != 1 && value != -1) {
            var power = createMathElementContent("mn", Math.abs(value).toString());
            item = createMathElement("msup");
            item.appendChild(unit);
            item.appendChild(power);
        }
        else {
            item = unit;
        }
        if (value > 0) {
            if (numerator.hasChildNodes()) {
                numerator.appendChild(createMathElementContent("mo", "·"));
            }
            numerator.appendChild(item);
        }
        else {
            if (denumerator.hasChildNodes()) {
                denumerator.appendChild(createMathElementContent("mo", "·"));
            }
            denumerator.appendChild(item);
        }
    }
    if (!numerator.hasChildNodes()) {
        numerator.appendChild(createMathElementContent("mn", "1"));
    }
    if (denumerator.hasChildNodes()) {
        var frac = createMathElement("mfrac");
        mrow.appendChild(frac);
        frac.appendChild(numerator);
        frac.appendChild(denumerator);
    }
    else {
        mrow.appendChild(numerator);
    }
    output.appendChild(math);
}
