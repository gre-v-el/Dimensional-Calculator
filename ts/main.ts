let input_box = <HTMLInputElement>document.getElementById("input")!;
let error_span = <HTMLSpanElement>document.getElementById("error-message")!;

let math_input = <MathMLElement>document.getElementById("math-input")!;
let math_si = <MathMLElement>document.getElementById("math-si")!;
let math_simplified = <MathMLElement>document.getElementById("math-simplified")!;

let input_desc = <HTMLSpanElement>document.getElementById("input-description")!;
let si_desc = <HTMLSpanElement>document.getElementById("si-description")!;
let simplified_desc = <HTMLSpanElement>document.getElementById("simplified-description")!;

function handle_input() {
	let fraction = parse_to_fraction(input_box.value);
	validate_fraction(fraction);
	render_fraction(fraction, math_input, error_span);
	
	if(fraction.error.length == 0) {
		let unit = fract_to_si_unit(fraction!);
		render_unit(unit, math_si, false);
		unit = reduce_unit(unit);
		render_unit(unit, math_simplified, true);
	}
	else {
		math_si.style.opacity = "0";
		math_simplified.style.opacity = "0";
	}
}

input_box.addEventListener("keyup", handle_input);
handle_input();