// GameB from Team One - Charlotte, Chloe, and Emma

function preload() {
	partyConnect("wss://demoserver.p5party.org", "team1_gameB"); 
}

function setup() {
	createCanvas(800, 800);
    drawShapes();
}

function draw() {
	if (mouseIsPressed) {
		push();
		fill("#f2f2f2");
		noStroke();
		ellipse(mouseX, mouseY, 50);
		pop();
	}

    // screen divider
	line(width / 2, 0, width / 2, height);
}

function drawShapes() {
    background("#f2f2f2");

	// left shape
	fill("red");
	ellipse(width / 4, height / 2, 100);

	// right shape
	fill("blue");
	ellipse(width - 200, height / 2, 100);
}

function mouseDragged() {
    push();
    noStroke();
    fill("#f2f2f2");
    ellipse(mouseX, mouseY, 50);
    pop();
}
