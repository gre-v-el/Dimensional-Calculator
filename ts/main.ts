let input_element = <HTMLInputElement>document.getElementById("input")!;
let si_output_element = <HTMLDivElement>document.getElementById("si-output")!;
let simple_output_element = <HTMLDivElement>document.getElementById("simple-output")!;
let math_element = <HTMLDivElement>document.getElementById("math-input")!;
let error_element = <HTMLSpanElement>document.getElementById("error-message")!;
let button_element = <HTMLButtonElement>document.getElementById("calculate-button")!;

let current_fraction: Fraction|undefined;

function handle_input() {
	let fraction = parse_to_fraction(input_element.value);
	validate_fraction(fraction);
	render_fraction(fraction, math_element, error_element);

	current_fraction = fraction.error.length > 0 ? undefined : fraction;

	button_element.disabled = current_fraction == undefined;
}

function calculate() {
	let unit = fract_to_si_unit(current_fraction!);
	render_unit(unit, si_output_element);
	reduce_unit(unit);
	console.log(unit);
	render_unit(unit, simple_output_element);
}

input_element.addEventListener("keyup", handle_input);
handle_input();
button_element.addEventListener("click", calculate);