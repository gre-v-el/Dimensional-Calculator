const MathNS = `http://www.w3.org/1998/Math/MathML`;
const createMathElement = (tag: string) => document.createElementNS(MathNS, tag);

type Fraction = {
	numerator: string[],
	denumerator: string[],
	error: string,
}

function render_math(input: string, output: HTMLDivElement) {
	let fraction_data: Fraction = parse_to_fraction(input);	

	let math = createMathElement("math");
	math.setAttribute("display", "block");

	let frac = createMathElement("mfrac");
	let numerator = createMathElement("mrow");
	let denumenator = createMathElement("mrow");
	
	populate_mrow(numerator, fraction_data.numerator);
	populate_mrow(denumenator, fraction_data.denumerator);

	frac.appendChild(numerator);
	frac.appendChild(denumenator);

	math.appendChild(frac);

	output.innerHTML = "";
	output.appendChild(math);
}

// kg *m/s^2
function parse_to_fraction(input: string): Fraction {
	let breaks = [" ", "*", "/", "^"];

	let num = [];
	let denum = [];

	let in_nom = true;
	let in_pow = false;
	let error = "";

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
		if(buf_start == -1) continue;

		let unit = input.substring(buf_start, i);
		buf_start = -1;

		if(in_pow) {
			in_pow = false;
			unit = "pow:" + unit;
		}

		if(in_nom) num.push(unit);
		else denum.push(unit);

		if(char == "/") {
			if(in_nom) in_nom = false;
			else error = "Use only a single '/'";
		}
		if(char == "^") {
			in_pow = true;
		}
	}

	return {
		numerator: num,
		denumerator: denum,
		error: error,
	}
}

function populate_mrow(mrow: MathMLElement, units: string[]) {
	for(let i = 0; i < units.length; i ++) {
		let u = units[i];
		
		if(mrow.children.length > 0) {
			let multiplied = createMathElement("mo");
			multiplied.textContent = "·";
			mrow.appendChild(multiplied);
		}
		let unit = createMathElement("ms");
		unit.textContent = u;
		mrow.appendChild(unit);
	}
}