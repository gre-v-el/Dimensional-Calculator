let input_element = <HTMLInputElement>document.getElementById("input")!;
let output_element = <HTMLDivElement>document.getElementById("output")!;
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
	render_unit(fract_to_si_unit(current_fraction!), output_element);
}

input_element.addEventListener("keyup", handle_input);
handle_input();
button_element.addEventListener("click", calculate);