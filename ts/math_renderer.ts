const MathNS = `http://www.w3.org/1998/Math/MathML`;
const createMathElement = (tag: string) => document.createElementNS(MathNS, tag);

function render_fraction(fraction_data: Fraction, output: HTMLDivElement, error: HTMLSpanElement) {
	output.innerHTML = "";
	error.textContent = fraction_data.error;

	if(fraction_data.hard_error) return;

	let math = createMathElement("math");
	math.setAttribute("display", "block");
	
	let numerator = createMathElement("mrow");
	populate_mrow(numerator, fraction_data.numerator);
	
	if(fraction_data.denumerator.length > 0) {
		let frac = createMathElement("mfrac");
		let denumenator = createMathElement("mrow");
		
		populate_mrow(denumenator, fraction_data.denumerator);
		
		frac.appendChild(numerator);
		frac.appendChild(denumenator);
		
		math.appendChild(frac);
	}
	else {
		math.appendChild(numerator);
	}
	output.appendChild(math);
}


function populate_mrow(mrow: MathMLElement, units: Factor[]) {
	for(let i = 0; i < units.length; i ++) {
		let u = units[i];
		
		if(mrow.children.length > 0) {
			let multiplied = createMathElement("mo");
			multiplied.textContent = "·";
			mrow.appendChild(multiplied);
		}
		if(u.power == "1") {
			let unit = createMathElement("mi");
			unit.textContent = u.value;

			if(u.error) unit.setAttribute("style", "color: red;");

			mrow.appendChild(unit);
		}
		else {
			let unit = createMathElement("msup");
			let base = createMathElement("mi");
			base.textContent = u.value;
			let power = createMathElement("mn");
			power.textContent = u.power;
			unit.appendChild(base);
			unit.appendChild(power);

			if(u.error) unit.setAttribute("style", "color: red;");

			mrow.appendChild(unit);
		}
	}
}