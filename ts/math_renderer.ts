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
		else if(Number(u.power) < 1 && ((1 / Number(u.power)) % 1).toFixed(3) == "0.000") {
			let degree = Math.round(1 / parseFloat(u.power)).toString();

			let root = degree == "2" ? createMathElement("msqrt") : createMathElement("mroot");

			root.appendChild(createMathElementContent("mi", u.value));
			if(degree != "2") root.appendChild(createMathElementContent("mn", degree));
			
			mrow.appendChild(root);
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
	let mult: number = Math.abs(multiplier);
	
	if(mult == 0)  {
		output.appendChild(createMathElementContent("mn", "0"));
		return;
	}
	if(mult == Number.POSITIVE_INFINITY) {
		output.appendChild(createMathElementContent("mo", "∞"));
		return;
	}
	if(mult == Number.NEGATIVE_INFINITY) {
		output.appendChild(createMathElementContent("mo", "-∞"));
		return;
	}

	let added = false;
	if(f.denumerator.length == 0 && 
	   f.numerator.length == 1 && 
	   f.numerator[0].power == "1" && 
 	   f.numerator[0].value != "1" &&
	   (use_prefixes || f.numerator[0].value == "g")
	   ) 
	{
		let exp = Math.floor(Math.log10(mult));
		exp = Math.floor(exp / 3) * 3;
		let mult_digit = mult / 10 ** exp;

		let prefix = UNITS.prefixes.find((p) => p.exponent == exp);
		
		if(prefix) {
			if(mult_digit.toFixed(3) != "1.000" || multiplier < 0) {
				output.appendChild(create_floating_point(mult_digit * Math.sign(multiplier)));
				output.appendChild(createMathElementContent("mo", "·"));
			}
			f.numerator[0].value = prefix.symbol + f.numerator[0].value;
			added = true;
		}
	}
	if(!added) {
		let exp = Math.floor(Math.log10(mult));
		let mult_digit = mult / 10 ** exp;
		
		if(mult_digit.toFixed(3) != "1.000" || multiplier < 0) {
			output.appendChild(create_floating_point(mult_digit * Math.sign(multiplier)));
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

	let multiplier = v.multiplier;
	if(use_prefixes && f.denumerator.length == 0 && f.numerator.length == 1 && f.numerator[0].value == "kg" && f.numerator[0].power == "1") {
		f.numerator[0].value = "g";
		multiplier *= 1000;
	}

	if(Math.abs(multiplier).toFixed(3) != "1.000") {
		render_multiplier(f, multiplier, output, use_prefixes);
	}

	render_fraction(f, output, undefined, false);
}