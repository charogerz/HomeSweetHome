// GameB from Team One - Charlotte, Chloe, Sophie, and Emma

let shared;
let my, guests;
let roomImg;
let bg;
let tableHighlight, tableHighlightImg;

function preload() {
	partyConnect("wss://demoserver.p5party.org", "team1_gameB"); 
	guests = partyLoadGuestShareds();
	my = partyLoadMyShared();
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

function mouseMoved(e) {
	my.x = mouseX;
	my.y = mouseY;
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

	for (const guest of guests) {
		fill("yellow");
		ellipse(guest.x, guest.y, 30, 30);
	}
}

function drawIntro() {

}

function drawMain() {
	image(bg, 0, 0, 800, 800);

	// table hover
	
	if (mouseX > 80 && mouseX < 400 && mouseY > 435 && mouseY < 700) {
		image(tableHighlightImg, 81, 435, 307, 307);
	}
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