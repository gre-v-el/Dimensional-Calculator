const MathNS = `http://www.w3.org/1998/Math/MathML`;
const createMathElement = (tag: string) => document.createElementNS(MathNS, tag);
const createMathElementContent = (tag: string, content: string) => {
	let e = document.createElementNS(MathNS, tag);
	e.textContent = content;
	return e;
} 

function render_fraction(fraction_data: Fraction, output: MathMLElement, error?: HTMLSpanElement) {
	if(fraction_data.error.length > 0) error!.textContent = fraction_data.error;

	if(fraction_data.hard_error) return;

	let numerator = createMathElement("mrow");
	populate_mrow(numerator, fraction_data.numerator);
	
	if(fraction_data.denumerator.length > 0) {
		let frac = createMathElement("mfrac");
		let denumenator = createMathElement("mrow");
		
		populate_mrow(denumenator, fraction_data.denumerator);
		
		frac.appendChild(numerator);
		frac.appendChild(denumenator);
		
		output.appendChild(frac);
	}
	else {
		output.appendChild(numerator);
	}
}


function populate_mrow(mrow: MathMLElement, units: Factor[]) {
	for(let u of units) {
		if(mrow.children.length > 0) {
			let multiplied = createMathElementContent("mo", "·");
			mrow.appendChild(multiplied);
		}
		if(u.power == "1") {
			let unit = createMathElementContent("mi", u.value);
			if(u.error) unit.setAttribute("style", "color: red;");
			mrow.appendChild(unit);
		}
		else {
			let unit = createMathElement("msup");
			let base = createMathElementContent("mi", u.value);
			let power = createMathElementContent("mn", u.power);
			unit.appendChild(base);
			unit.appendChild(power);

			if(u.error) unit.setAttribute("style", "color: red;");

			mrow.appendChild(unit);
		}
	}
}

function render_unit(v: Unit, output: MathMLElement) {
	if(v.multiplier != 1) {
		output.appendChild(createMathElementContent("mn", v.multiplier.toString()));
		output.appendChild(createMathElementContent("mo", "·"));
	}
	
	let f: Fraction = {
		numerator: [],
		denumerator: [],
		error: "",
		hard_error: false,
	};

	for(let k in v.definition) {
		// @ts-ignore
		let value = v.definition[k];
		if(value == 0) continue;

		let factor: Factor = {
			value: k,
			power: Math.abs(value).toString(),
			error: false,
		};

		if(value > 0) f.numerator.push(factor);
		else f.denumerator.push(factor);
	}

	for(let c of v.compounds) {
		let factor: Factor = {
			value: c.name,
			power: Math.abs(c.power).toString(),
			error: false,
		};

		if(c.power > 0) f.numerator.push(factor);
		else f.denumerator.push(factor);
	}

	render_fraction(f, output);
}