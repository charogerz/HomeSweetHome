// GameB from Team One - Charlotte, Chloe, Sophie, and Emma

let shared;
let my, guests;
let roomImg;
let bg;
let tableHighlightImg;

function preload() {
	partyConnect("wss://demoserver.p5party.org", "team1_gameB"); 
	guests = partyLoadGuestShareds();
	my = partyLoadMyShared();
	shared = partyLoadShared("globals", {
		gameState: "table-game"
	});
	roomImg = loadImage("./assets/room-layout.png");
	tableHighlightImg = loadImage("./assets/table-highlight.png");
	tableFullImg = loadImage("./assets/dining-table.png");
}

function setup() {
	createCanvas(800, 800);
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
	} else if (shared.gameState === "table-game") {
		drawTableGame();
	}

	if (shared.gameState === "intro" && keyIsPressed === true) {
		shared.gameState = "playing";
	}

	// player cursors
	for (const guest of guests) {
		if (partyIsHost()) {
			fill("red");
		} else {
			fill("yellow");
		}
		ellipse(guest.x, guest.y, 30, 30);
	}
}

function drawIntro() {
	background("#f2f2f2");
	textFont("Verdana");
	textAlign(CENTER);
	textStyle(BOLD);
	fill("#000066");

	// title
	push();
	textSize(50);
	text("Welcome to Title Here!", width/2, height/3);
	pop();

	// credits and brief intro
	push();
	textSize(25);
	rectMode(CENTER);
	text("A game by Crikey!", width/2, 325);
	text("Many hands make light work!", width/2, 450);
	text("Work with your \"roommate\" to check off the to-do list items and tidy the room.", width/2, 460, 530);
	text("Press any button to continue >>>", width/2, 650);
	pop();
}

function drawMain() {
	background(roomImg);

	// table hover
	for (const guest of guests) {
		if (guest.x > 80 && guest.x < 400 && guest.y > 435 && guest.y < 700) {
			image(tableHighlightImg, 81, 435, 307, 307);
			if (mouseIsPressed) {
				shared.gameState = "table-game";
			}
		}
	}
}

function drawTableGame() {
	background("#f2f2f2");
	tableFullImg.resize(1000, 800);
	image(tableFullImg, -100, 90);

	push();
	stroke("orange");
	strokeWeight(20);
	noFill();
	rect(385, 210, 105, 132, 2);
	pop();

	push();
	stroke("red");
	strokeWeight(20);
	noFill();
	rect(228, 160, 162, 135, 2);
	pop();

	push();
	angleMode(DEGREES);
	stroke("green");
	strokeWeight(20);
	noFill();
	rotate(45);
	rect(800, -100, 105, 132, 2);
	pop();
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