"use strict";
var input_element = document.getElementById("input");
var math_element = document.getElementById("math-input");
var error_element = document.getElementById("error-message");
document.addEventListener("keyup", function () { return render_math(input_element.value, math_element, error_element); });
