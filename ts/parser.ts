function is_basic_unit(u: string): boolean {
	return UNITS.SI.some((s) => s.symbol == u) ||
           UNITS.derived.some((d) => d.symbol == u);
}

function is_unit_good(u: string): boolean {
	if(is_basic_unit(u) || !isNaN(Number(u))) return true;

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
				f.error = "I don't know these units (" + u.value + ")";
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

		if(buf_start != -1 && i > buf_start) {
			let item = input.substring(buf_start, i);
			buf_start = -1;
			if(item == "Ohm" || item == "ohm") item = "Ω";

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
			if(i == 0) {
				f.error = "Put something before the '/', for example a '1'.";
				f.hard_error = true;
				return f;
			}
			if(current == f.denumerator) {
				f.error = "Use only a single '/'";
				f.hard_error = true;
				return f;
			}
			current = f.denumerator;
		}
		if(char == "^") {
			if(in_pow) {
				f.error = "Invalid use of '^'";
			}
			in_pow = true;
		}
	}

	return f;
}