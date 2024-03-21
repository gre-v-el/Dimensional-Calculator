"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var c_clicks = 0;
var c_letter = document.getElementById("c-letter");
var c_background = c_letter.children[0];
var input_box = document.getElementById("input");
var error_span = document.getElementById("error-message");
var math_input = document.getElementById("math-input");
var math_si = document.getElementById("math-si");
var math_simplified = document.getElementById("math-simplified");
var math_cs = document.getElementById("math-cs");
function handle_input() {
    var fraction = parse_to_fraction(input_box.value);
    validate_fraction(fraction, c_clicks >= 7);
    render_fraction(fraction, math_input, error_span);
    if (fraction.error.length == 0) {
        var unit = fract_to_unit(fraction);
        expand_si(unit);
        var pure_si_unit = __assign({}, unit);
        render_unit(unit, math_si, false);
        unit = reduce_unit_greedy(unit);
        render_unit(unit, math_simplified, true);
        var cs_unit = si_to_cs(pure_si_unit.definition, pure_si_unit.multiplier);
        render_unit(cs_unit, math_cs, false);
    }
    else {
        math_si.style.opacity = "0";
        math_simplified.style.opacity = "0";
        math_cs.style.opacity = "0";
    }
}
input_box.addEventListener("input", handle_input);
handle_input();
c_letter.addEventListener("click", function () {
    if (c_clicks >= 7)
        return;
    c_clicks++;
    if (c_clicks >= 7) {
        document.getElementById("seven-cs-result").style.display = "block";
        document.getElementById("secret").style.display = "none";
        document.getElementById("seven-cs-result").style.scale = "1 1";
        document.getElementById("hidden-header").style.opacity = "1";
        document.getElementById("hidden-text-blur").id = "";
        document.getElementById("hidden-text-explainer").style.display = "none";
        c_background.style.transition = "scale 2s linear";
        c_background.style.scale = "50";
        document.body.style.backgroundColor = "#e28f29";
        handle_input();
        setTimeout(function () {
            c_background.style.display = "none";
        }, 2000);
    }
    else {
        c_letter.id = "c-clicked";
        c_background.style.scale = Math.pow(1.4, c_clicks + 1).toString();
    }
});
