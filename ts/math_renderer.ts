const MathNS = `http://www.w3.org/1998/Math/MathML`;
const createMathElement = (tag: string) => document.createElementNS(MathNS, tag);
const createMathElementContent = (tag: string, content: string) => {
	let e = document.createElementNS(MathNS, tag);
	e.textContent = content;
	return e;
} 

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

// TODO: should construct a Fraction and call render_fraction()
function render_unit(v: Unit, output: HTMLDivElement) {
	output.innerHTML = "";

	let math = createMathElement("math");
	math.setAttribute("display", "block");

	let mrow = createMathElement("mrow");
	math.appendChild(mrow);

	if(v.multiplier != 1)  {
		mrow.appendChild(createMathElementContent("mn", v.multiplier.toString()));
		mrow.appendChild(createMathElementContent("mo", "·"));
	}
	
	let numerator = createMathElement("mrow");
	let denumerator = createMathElement("mrow");

	for(let c of v.compounds) {
		let item;
		
		if(c.power == 1 || c.power == -1) {
			item = createMathElementContent("mi", c.name);
		}
		else {
			item = createMathElement("msup");
			let unit = createMathElementContent("mi", c.name);
			let power = createMathElementContent("mn", Math.abs(c.power).toString());
			item.appendChild(unit);
			item.appendChild(power);
		}
		
		if(c.power > 0) {
			if(numerator.hasChildNodes()) {
				numerator.appendChild(createMathElementContent("mo", "·"));
			}
			numerator.appendChild(item);
		}
		else {
			if(denumerator.hasChildNodes()) {
				denumerator.appendChild(createMathElementContent("mo", "·"));
			}
			denumerator.appendChild(item);
		}
	}
	for(let k in v.definition) {
		// @ts-ignore
		let value = v.definition[k];
		if(value == 0) continue;

		let item;

		let unit = createMathElementContent("mi", k);
		
		if(value != 1 && value != -1) {
			let power = createMathElementContent("mn", Math.abs(value).toString());
			item = createMathElement("msup");
			item.appendChild(unit);
			item.appendChild(power);
		}
		else {
			item = unit;
		}

		if(value > 0) {
			if(numerator.hasChildNodes()) {
				numerator.appendChild(createMathElementContent("mo", "·"));
			}
			numerator.appendChild(item);
		}
		else {
			if(denumerator.hasChildNodes()) {
				denumerator.appendChild(createMathElementContent("mo", "·"));
			}
			denumerator.appendChild(item);
		}

	}

	if(!numerator.hasChildNodes()) {
		numerator.appendChild(createMathElementContent("mn", "1"));
	}

	if(denumerator.hasChildNodes()) {
		let frac = createMathElement("mfrac");
		mrow.appendChild(frac);
		frac.appendChild(numerator);
		frac.appendChild(denumerator);
	}
	else {
		mrow.appendChild(numerator);
	}
	
	output.appendChild(math);
}