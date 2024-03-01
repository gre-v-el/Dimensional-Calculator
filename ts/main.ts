function calculate() {
	var input: string = (<HTMLInputElement>document.getElementById("input")).value;
	var output = document.getElementById("output")!;
	output.innerHTML = "Hi, " + input + "!";
}