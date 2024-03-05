"use strict";
var input_element = document.getElementById("input");
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
input_element.addEventListener("keyup", handle_input);
handle_input();
