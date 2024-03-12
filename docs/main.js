"use strict";
var input_element = document.getElementById("input");
var si_output_element = document.getElementById("math-si");
var simple_output_element = document.getElementById("math-simplified");
var math_element = document.getElementById("math-input");
var error_element = document.getElementById("error-message");
function handle_input() {
    math_element.innerHTML = "";
    si_output_element.innerHTML = "";
    simple_output_element.innerHTML = "";
    var fraction = parse_to_fraction(input_element.value);
    validate_fraction(fraction);
    render_fraction(fraction, math_element, error_element);
    if (fraction.error.length == 0) {
        var unit = fract_to_si_unit(fraction);
        render_unit(unit, si_output_element);
        unit = reduce_unit(unit);
        render_unit(unit, simple_output_element);
    }
}
input_element.addEventListener("keyup", handle_input);
handle_input();
