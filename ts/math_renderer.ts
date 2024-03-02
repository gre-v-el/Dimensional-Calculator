const MathNS = `http://www.w3.org/1998/Math/MathML`;
const createMathElement = (tag: string) => document.createElementNS(MathNS, tag);

function render_math(input: string, output: HTMLDivElement) {
	let math = createMathElement("math");
	math.setAttribute("display", "block");


	let frac = createMathElement("mfrac");
	let numerator = createMathElement("ms");
	let denominator = createMathElement("ms");

	numerator.textContent = input;
	denominator.textContent = input;

	frac.appendChild(numerator);
	frac.appendChild(denominator);

	math.appendChild(frac);

	output.innerHTML = "";
	output.appendChild(math);
}