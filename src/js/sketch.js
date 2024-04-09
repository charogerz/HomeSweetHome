// GameB from Team One - Charlotte, Chloe, and Emma

let shapes = [];

function preload() {
	partyConnect("wss://demoserver.p5party.org", "team1_gameB");
}

function setup() {
	createCanvas(800, 800);
}

function draw() {
	background("#f2f2f2");

	// screen divider
	line(width / 2, 0, width / 2, height);

	// left shape
	fill("red");
	ellipse(width / 4, height / 2, 100);

	// right shape
	fill("blue");
	ellipse(width - 200, height / 2, 100);

	if (mouseIsPressed) {
		push();
		fill("#f2f2f2");
		noStroke();
		ellipse(mouseX, mouseY, 50);
		pop();
	}
}
