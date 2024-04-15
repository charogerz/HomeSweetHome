// GameB from Team One - Charlotte, Chloe, Sophie, and Emma

let shared;
let roomImg;
let bg;
let tableHighlight, tableHighlightImg;

function preload() {
	partyConnect("wss://demoserver.p5party.org", "team1_gameB"); 
	shared = partyLoadShared("globals", {
		gameState: "playing"
	});
	roomImg = loadImage("./assets/room-layout.png");
	tableHighlightImg = loadImage("./assets/table-highlight.png");
}

function setup() {
	createCanvas(800, 800);

	bg = createGraphics(800, 800);
	bg.image(roomImg, 0, 0, 800, 800);
}

function draw() {
	background("#f2f2f2");

	if (shared.gameState === "intro") {
		drawIntro();
	} else if (shared.gameState === "playing") {
		drawMain();
	}

	if (shared.gameState === "intro" && keyIsPressed === true) {
		shared.gameState = "playing";
	}
}

function drawIntro() {

}

function drawMain() {
	image(bg, 0, 0, 800, 800);

}













////////// IGNORE BELOW, KEEPING CODE NOTES FOR LATER

// if (mouseIsPressed) {
	// 	push();
	// 	bg.fill("#f2f2f2");
	// 	bg.noStroke();
	// 	bg.ellipse(mouseX, mouseY, 50);
	// 	pop();
	// }

// function mouseDragged() {
// 	push();
// 	noStroke();
// 	fill("#f2f2f2");
// 	ellipse(mouseX, mouseY, 50);
// 	pop();
// }