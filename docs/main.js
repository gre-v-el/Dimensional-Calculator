"use strict";
var input_element = document.getElementById("input");
var math_element = document.getElementById("math-input");
var error_element = document.getElementById("error-message");
function construct_mathml() {
    var fraction = parse_to_fraction(input_element.value);
    validate_fraction(fraction);
    render_fraction(fraction, math_element, error_element);
}
input_element.addEventListener("keyup", construct_mathml);
construct_mathml();
