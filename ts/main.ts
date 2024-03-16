let c_clicks = 0;
let c_letter = <HTMLSpanElement>document.getElementById("c-letter")!;
let c_background = c_letter.children[0] as HTMLDivElement;

let input_box = <HTMLInputElement>document.getElementById("input")!;
let error_span = <HTMLSpanElement>document.getElementById("error-message")!;

let math_input = <MathMLElement>document.getElementById("math-input")!;
let math_si = <MathMLElement>document.getElementById("math-si")!;
let math_simplified = <MathMLElement>document.getElementById("math-simplified")!;
let math_cs = <MathMLElement>document.getElementById("math-cs")!;

function handle_input() {
	let fraction = parse_to_fraction(input_box.value);
	validate_fraction(fraction);
	render_fraction(fraction, math_input, error_span);
	
	if(fraction.error.length == 0) {
		let unit = fract_to_unit(fraction!);

		expand_si(unit);
		let pure_si_unit = {...unit};
		render_unit(unit, math_si, false);
		
		unit = reduce_unit_greedy(unit);
		render_unit(unit, math_simplified, true);

		let cs_unit = si_to_cs(pure_si_unit.definition, pure_si_unit.multiplier);
		render_unit(cs_unit, math_cs, false);
	}
	else {
		math_si.style.opacity = "0";
		math_simplified.style.opacity = "0";
		math_cs.style.opacity = "0";
	}
}

input_box.addEventListener("input", handle_input);
handle_input();

c_letter.addEventListener("click", () => {
	if(c_clicks >= 7) return;

	c_clicks ++;
	if(c_clicks >= 7) {
		document.getElementById("seven-cs-result")!.style.display = "block";
		document.getElementById("secret")!.style.display = "none";
		document.getElementById("seven-cs-result")!.style.scale = "1 1";
		document.getElementById("hidden-header")!.style.opacity = "1";

		c_background.style.transition = "scale 2s linear";
		c_background.style.scale = "50";
		document.body.style.backgroundColor = "#e28f29";

		setTimeout(() => {
			c_background.style.display = "none";
		}, 2000);
	}
	else {
		c_letter.id = "c-clicked";
		c_background.style.scale = Math.pow(1.4, c_clicks + 1).toString();
	}
});