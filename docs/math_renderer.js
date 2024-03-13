"use strict";
var MathNS = "http://www.w3.org/1998/Math/MathML";
var createMathElement = function (tag) { return document.createElementNS(MathNS, tag); };
var createMathElementContent = function (tag, content) {
    var e = document.createElementNS(MathNS, tag);
    e.textContent = content;
    return e;
};
function render_fraction(fraction_data, output, error, clear) {
    if (clear === void 0) { clear = true; }
    if (error && fraction_data.error.length > 0) {
        error.textContent = fraction_data.error;
        error.style.opacity = "1";
    }
    else if (error) {
        error.style.opacity = "0";
    }
    if (fraction_data.hard_error) {
        output.style.opacity = "0";
        return;
    }
    output.style.opacity = "1";
    if (clear)
        output.innerHTML = "";
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
function create_exponent(base, power) {
    var msup = createMathElement("msup");
    msup.appendChild(createMathElementContent("mi", base));
    msup.appendChild(createMathElementContent("mn", power));
    return msup;
}
function create_floating_point(value) {
    return createMathElementContent("mn", (Math.round(value * 1000) / 1000).toString());
}
function render_multiplier(f, multiplier, output, use_prefixes) {
    var added = false;
    if (use_prefixes &&
        f.denumerator.length == 0 &&
        f.numerator.length == 1 &&
        f.numerator[0].power == "1" &&
        f.numerator[0].value != "1") {
        var exp_1 = Math.floor(Math.log10(multiplier));
        exp_1 = Math.floor(exp_1 / 3) * 3;
        var mult = multiplier / Math.pow(10, exp_1);
        var prefix = UNITS.prefixes.find(function (p) { return p.exponent == exp_1; });
        if (mult.toFixed(3) != "1.000") {
            output.appendChild(create_floating_point(mult));
            output.appendChild(createMathElementContent("mo", "·"));
        }
        if (prefix) {
            f.numerator[0].value = prefix.symbol + f.numerator[0].value;
            added = true;
        }
    }
    else if (!added) {
        var exp = Math.floor(Math.log10(multiplier));
        var mult = multiplier / Math.pow(10, exp);
        if (mult.toFixed(3) != "1.000") {
            output.appendChild(create_floating_point(mult));
            output.appendChild(createMathElementContent("mo", "·"));
        }
        if (exp != 0) {
            output.appendChild(create_exponent("10", exp.toString()));
            output.appendChild(createMathElementContent("mo", "·"));
        }
    }
}
function render_unit(v, output, use_prefixes) {
    output.innerHTML = "";
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
    if (v.multiplier.toFixed(3) != "1.000") {
        render_multiplier(f, v.multiplier, output, use_prefixes);
    }
    render_fraction(f, output, undefined, false);
}
