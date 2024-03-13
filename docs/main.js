"use strict";
var input_box = document.getElementById("input");
var error_span = document.getElementById("error-message");
var math_input = document.getElementById("math-input");
var math_si = document.getElementById("math-si");
var math_simplified = document.getElementById("math-simplified");
function handle_input() {
    var fraction = parse_to_fraction(input_box.value);
    validate_fraction(fraction);
    render_fraction(fraction, math_input, error_span);
    if (fraction.error.length == 0) {
        var unit = fract_to_si_unit(fraction);
        render_unit(unit, math_si, false);
        unit = reduce_unit(unit);
        render_unit(unit, math_simplified, true);
    }
    else {
        math_si.style.opacity = "0";
        math_simplified.style.opacity = "0";
    }
}
input_box.addEventListener("keyup", handle_input);
handle_input();
