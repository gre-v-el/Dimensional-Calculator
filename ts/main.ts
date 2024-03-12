let input_element = <HTMLInputElement>document.getElementById("input")!;
let si_output_element = <HTMLDivElement>document.getElementById("si-output")!;
let simple_output_element = <HTMLDivElement>document.getElementById("simple-output")!;
let math_element = <HTMLDivElement>document.getElementById("math-input")!;
let error_element = <HTMLSpanElement>document.getElementById("error-message")!;


function handle_input() {
	let fraction = parse_to_fraction(input_element.value);
	validate_fraction(fraction);
	render_fraction(fraction, math_element, error_element);
	
	if(fraction.error.length == 0) {
		let unit = fract_to_si_unit(fraction!);
		render_unit(unit, si_output_element);
		unit = reduce_unit(unit);
		render_unit(unit, simple_output_element);
	}
	else {
		si_output_element.innerHTML = "";
		simple_output_element.innerHTML = "";
	}
}

input_element.addEventListener("keyup", handle_input);
handle_input();