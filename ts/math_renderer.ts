const MathNS = `http://www.w3.org/1998/Math/MathML`;
const createMathElement = (tag: string) => document.createElementNS(MathNS, tag);

type Factor = {
	value: string,
	power: string,
	error: boolean,
}

type Fraction = {
	numerator: Factor[],
	denumerator: Factor[],
	error: string,
}

function render_math(input: string, output: HTMLDivElement, error: HTMLSpanElement) {
	let fraction_data: Fraction = parse_to_fraction(input);	
	validate_fraction(fraction_data);
	
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
	output.innerHTML = "";
	output.appendChild(math);
	error.textContent = fraction_data.error;
}

function validate_fraction(f: Fraction) {
	if(f.numerator.length == 0) {
		f.numerator.push({
			value: "1",
			power: "1",
			error: false,
		});
	}

	for(let a of [f.numerator, f.denumerator]) {
		for(let u of a) {
			if(u.value == "") {
				f.error = "Empty value";
				u.error = true;
				return;
			}
			if(u.power == "") {
				f.error = "Empty power";
				u.error = true;
				return;
			}
			if(isNaN(Number(u.power))) {
				f.error = "Power is not a number";
				u.error = true;
				return;
			}
		}
	}
}

function parse_to_fraction(input: string): Fraction {
	let breaks = [" ", "*", "/", "^"];

	let f: Fraction = {
		numerator: [],
		denumerator: [],
		error: "",
	};
	let current = f.numerator;

	let in_pow = false;

	input.trim();
	input = input.split(/(\s+)/).join(" ");
	input += " ";

	let buf_start = 0;
	for(let i = 0; i < input.length; i ++) {
		let char = input.charAt(i);
		
		if(!breaks.includes(char)) {
			if(buf_start == -1) buf_start = i;
			continue;
		}
		if(buf_start != -1 && i > buf_start){
				let item = input.substring(buf_start, i);
				buf_start = -1;

				if(in_pow) {
					in_pow = false;

					if(current.length == 0) {
						f.error = "Invalid use of '^'";
						continue;
					}

					current[current.length - 1].power = item;
				}
				else {
					current.push({
						value: item,
						power: "1",
						error: false,
					});
				}
		}
		if(char == "/") {
			if(current == f.denumerator) f.error = "Use only a single '/'";
			current = f.denumerator;
		}
		if(char == "^") {
			in_pow = true;
		}
	}

	return f;
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