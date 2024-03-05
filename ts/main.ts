let input_element = <HTMLInputElement>document.getElementById("input")!;
let math_element = <HTMLDivElement>document.getElementById("math-input")!;
let error_element = <HTMLSpanElement>document.getElementById("error-message")!;

function construct_mathml() {
	let fraction = parse_to_fraction(input_element.value);
	validate_fraction(fraction);
	render_fraction(fraction, math_element, error_element);
}

input_element.addEventListener("keyup", construct_mathml);
construct_mathml();