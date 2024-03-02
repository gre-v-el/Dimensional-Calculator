"use strict";
var MathNS = "http://www.w3.org/1998/Math/MathML";
var createMathElement = function (tag) { return document.createElementNS(MathNS, tag); };
function render_math(input, output) {
    var math = createMathElement("math");
    math.setAttribute("display", "block");
    var frac = createMathElement("mfrac");
    var numerator = createMathElement("ms");
    var denominator = createMathElement("ms");
    numerator.textContent = input;
    denominator.textContent = input;
    frac.appendChild(numerator);
    frac.appendChild(denominator);
    math.appendChild(frac);
    output.innerHTML = "";
    output.appendChild(math);
}
