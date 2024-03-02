let input_element = <HTMLInputElement>document.getElementById("input")!;
let math_element = <HTMLDivElement>document.getElementById("math-input")!;

document.addEventListener("keyup", () => render_math(input_element.value, math_element))
