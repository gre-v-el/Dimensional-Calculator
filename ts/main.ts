let input_element = <HTMLInputElement>document.getElementById("input")!;
let si_output_element = <MathMLElement>document.getElementById("math-si")!;
let simple_output_element = <MathMLElement>document.getElementById("math-simplified")!;
let math_element = <MathMLElement>document.getElementById("math-input")!;
let error_element = <HTMLSpanElement>document.getElementById("error-message")!;


function handle_input() {
	math_element.innerHTML = "";
	si_output_element.innerHTML = "";
	simple_output_element.innerHTML = "";

	let fraction = parse_to_fraction(input_element.value);
	validate_fraction(fraction);
	render_fraction(fraction, math_element, error_element);
	
	if(fraction.error.length == 0) {
		let unit = fract_to_si_unit(fraction!);
		render_unit(unit, si_output_element);
		unit = reduce_unit(unit);
		render_unit(unit, simple_output_element);
	}
}

input_element.addEventListener("keyup", handle_input);
handle_input();