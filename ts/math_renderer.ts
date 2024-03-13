const MathNS = `http://www.w3.org/1998/Math/MathML`;
const createMathElement = (tag: string) => document.createElementNS(MathNS, tag);
const createMathElementContent = (tag: string, content: string) => {
	let e = document.createElementNS(MathNS, tag);
	e.textContent = content;
	return e;
} 

function render_fraction(fraction_data: Fraction, output: MathMLElement, error?: HTMLSpanElement, clear: boolean = true) {
	if(error && fraction_data.error.length > 0) {
		error!.textContent = fraction_data.error;
		error.style.opacity = "1";
	}
	else if(error) {
		error!.style.opacity = "0";
	}

	if(fraction_data.hard_error) {
		output.style.opacity = "0";
		return;
	}
	output.style.opacity = "1";
	if(clear) output.innerHTML = "";

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

function create_exponent(base: string, power: string) {
	let msup = createMathElement("msup");
	msup.appendChild(createMathElementContent("mi", base));
	msup.appendChild(createMathElementContent("mn", power));
	return msup;
}

function create_floating_point(value: number): MathMLElement {
	return createMathElementContent("mn", (Math.round(value*1000)/1000).toString());
}

function render_multiplier(f: Fraction, multiplier: number, output: MathMLElement, use_prefixes: boolean) {
	let added = false;
	if(use_prefixes && 
		f.denumerator.length == 0 && 
		f.numerator.length == 1 && 
		f.numerator[0].power == "1" && 
		f.numerator[0].value != "1") 
	{
		let exp = Math.floor(Math.log10(multiplier));
		exp = Math.floor(exp / 3) * 3;
		let mult = multiplier / 10 ** exp;

		let prefix = UNITS.prefixes.find((p) => p.exponent == exp);

		if(mult.toFixed(3) != "1.000") {
			output.appendChild(create_floating_point(mult));
			output.appendChild(createMathElementContent("mo", "·"));
		}
		if(prefix) {
			f.numerator[0].value = prefix.symbol + f.numerator[0].value;
			added = true;
		}
	}
	else if(!added) {
		let exp = Math.floor(Math.log10(multiplier));
		let mult = multiplier / 10 ** exp;
		
		if(mult.toFixed(3) != "1.000") {
			output.appendChild(create_floating_point(mult));
			output.appendChild(createMathElementContent("mo", "·"));
		}
		if(exp != 0) {
			output.appendChild(create_exponent("10", exp.toString()));
			output.appendChild(createMathElementContent("mo", "·"));
		}
	}
}

function render_unit(v: Unit, output: MathMLElement, use_prefixes: boolean) {
	output.innerHTML = "";
	
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

	if(f.numerator.length == 0) f.numerator.push({value: "1", power: "1", error: false});

	if(v.multiplier.toFixed(3) != "1.000") {
		render_multiplier(f, v.multiplier, output, use_prefixes);
	}

	render_fraction(f, output, undefined, false);
}