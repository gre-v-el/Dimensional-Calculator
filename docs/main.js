"use strict";
var input_element = document.getElementById("input");
var si_output_element = document.getElementById("si-output");
var simple_output_element = document.getElementById("simple-output");
var math_element = document.getElementById("math-input");
var error_element = document.getElementById("error-message");
var button_element = document.getElementById("calculate-button");
var current_fraction;
function handle_input() {
    var fraction = parse_to_fraction(input_element.value);
    validate_fraction(fraction);
    render_fraction(fraction, math_element, error_element);
    current_fraction = fraction.error.length > 0 ? undefined : fraction;
    button_element.disabled = current_fraction == undefined;
}
function calculate() {
    var unit = fract_to_si_unit(current_fraction);
    render_unit(unit, si_output_element);
    reduce_unit(unit);
    console.log(unit);
    render_unit(unit, simple_output_element);
}
input_element.addEventListener("keyup", handle_input);
handle_input();
button_element.addEventListener("click", calculate);
