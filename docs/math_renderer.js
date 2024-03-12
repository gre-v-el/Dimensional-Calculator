"use strict";
var MathNS = "http://www.w3.org/1998/Math/MathML";
var createMathElement = function (tag) { return document.createElementNS(MathNS, tag); };
var createMathElementContent = function (tag, content) {
    var e = document.createElementNS(MathNS, tag);
    e.textContent = content;
    return e;
};
function render_fraction(fraction_data, output, error) {
    if (error)
        error.textContent = fraction_data.error;
    if (fraction_data.hard_error)
        return;
    var numerator = createMathElement("mrow");
    populate_mrow(numerator, fraction_data.numerator);
    if (fraction_data.denumerator.length > 0) {
        var frac = createMathElement("mfrac");
        var denumenator = createMathElement("mrow");
        populate_mrow(denumenator, fraction_data.denumerator);
        frac.appendChild(numerator);
        frac.appendChild(denumenator);
        output.appendChild(frac);
    }
    else {
        output.appendChild(numerator);
    }
}
function populate_mrow(mrow, units) {
    for (var _i = 0, units_1 = units; _i < units_1.length; _i++) {
        var u = units_1[_i];
        if (mrow.children.length > 0) {
            var multiplied = createMathElementContent("mo", "·");
            mrow.appendChild(multiplied);
        }
        if (u.power == "1") {
            var unit = createMathElementContent("mi", u.value);
            if (u.error)
                unit.setAttribute("style", "color: red;");
            mrow.appendChild(unit);
        }
        else {
            var unit = createMathElement("msup");
            var base = createMathElementContent("mi", u.value);
            var power = createMathElementContent("mn", u.power);
            unit.appendChild(base);
            unit.appendChild(power);
            if (u.error)
                unit.setAttribute("style", "color: red;");
            mrow.appendChild(unit);
        }
    }
}
function render_unit(v, output) {
    if (v.multiplier != 1) {
        output.appendChild(createMathElementContent("mn", v.multiplier.toString()));
        output.appendChild(createMathElementContent("mo", "·"));
    }
    var f = {
        numerator: [],
        denumerator: [],
        error: "",
        hard_error: false,
    };
    for (var k in v.definition) {
        // @ts-ignore
        var value = v.definition[k];
        if (value == 0)
            continue;
        var factor = {
            value: k,
            power: Math.abs(value).toString(),
            error: false,
        };
        if (value > 0)
            f.numerator.push(factor);
        else
            f.denumerator.push(factor);
    }
    for (var _i = 0, _a = v.compounds; _i < _a.length; _i++) {
        var c = _a[_i];
        var factor = {
            value: c.name,
            power: Math.abs(c.power).toString(),
            error: false,
        };
        if (c.power > 0)
            f.numerator.push(factor);
        else
            f.denumerator.push(factor);
    }
    if (f.numerator.length == 0)
        f.numerator.push({ value: "1", power: "1", error: false });
    render_fraction(f, output);
}
