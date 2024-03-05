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
	hard_error: boolean,
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

function is_basic_unit(u: string): boolean {
	return UNITS.SI.some((s) => s.symbol == u) ||
           UNITS.derived.some((d) => d.symbol == u);
}

function is_unit_good(u: string): boolean {
	if(is_basic_unit(u) || u == "1") return true;

	for(let p of UNITS.prefixes) {
		if(u.startsWith(p.symbol)) {
			let candidate = u.substring(p.symbol.length);

			if(is_basic_unit(candidate)) {
				return true;
			}
		}
	}

	return false;
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
			if(isNaN(Number(u.power))) {
				f.error = "Power is not a number";
				u.error = true;
			}
		}
	}
	if(f.error.length > 0) return;

	for(let a of [f.numerator, f.denumerator]) {
		for(let u of a) {
			if(!is_unit_good(u.value)) {
				u.error = true;
				f.error = "I don't know these units";
			}
		}
	}
}

function parse_to_fraction(input: string): Fraction {
	input = input.trim();
	input = input.split(/(\s+)/).join(" ");
	input += " ";

	let breaks = [" ", "*", "/", "^"];

	let f: Fraction = {
		numerator: [],
		denumerator: [],
		error: "",
		hard_error: false,
	};

	let current = f.numerator;

	let in_pow = false;
	let buf_start = 0;

	for(let i = 0; i < input.length; i ++) {
		let char = input.charAt(i);
		
		if(!breaks.includes(char)) {
			if(buf_start == -1) buf_start = i;
			continue;
		}

		if(i == 0 && char == "/") {
			f.error = "Put something before the '/', for example a '1'.";
			f.hard_error = true;
		}
		else if(buf_start != -1 && i > buf_start){
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
			if(current == f.denumerator) {
				f.error = "Use only a single '/'";
				f.hard_error = true;
			}
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