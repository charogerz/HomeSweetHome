// GameB from Team One - Charlotte, Chloe, Sophie, and Emma

class Rect {
	constructor(l = 0, t = 0, w = 0, h = 0) {
		this.l = l;
		this.t = t;
		this.w = w;
		this.h = h;
	}
}

class Point {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
}

function pointInRect(p, r) {
	return p.x > r.l && p.x < r.l + r.w && p.y > r.t && p.y < r.t + r.h;
}

const my_id = Math.random();

let shared;
let my, guests;
let roomImg;
let bg;
let tableHighlightImg, tableFullImg;
let windowHighlightImg, windowFullImg;

function preload() {
	partyConnect("wss://demoserver.p5party.org", "team1_gameB");
	guests = partyLoadGuestShareds();
	my = partyLoadMyShared();
	shared = partyLoadShared("globals", {
		gameState: "intro"
	});
	roomImg = loadImage("./assets/room-layout.png");
	tableHighlightImg = loadImage("./assets/table-highlight.png");
	tableFullImg = loadImage("./assets/dining-table.png");
	windowHighlightImg = loadImage("./assets/window-highlight.png");
	windowFullImg = loadImage("./assets/window.png");
}

function setup() {
	createCanvas(800, 800);

	if (partyIsHost()) {
		shared.sprites = [];
	}

	partySubscribe("updateSprite", onUpdateSprite);
}

function mouseMoved(e) {
	my.x = mouseX;
	my.y = mouseY;
}

function onUpdateSprite({ id, updates }) {
	if (!partyIsHost()) return;
	const s = shared.sprites.find((s) => s.id === id);
	if (!s) return;
	for (const [k, v] of Object.entries(updates)) {
		s[k] = v;
	}
}

function draw() {
	background("#f2f2f2");

	if (shared.gameState === "intro") {
		drawIntro();
	} else if (shared.gameState === "playing") {
		drawMain();
	} else if (shared.gameState === "table-game") {
		drawTableGame();
	} else if (shared.gameState === "window-game") {
		drawWindowGame();
	}

	if (shared.gameState === "intro" && keyIsPressed === true) {
		shared.gameState = "playing";
	}

	// player cursors
	for (const guest of guests) {
		fill("yellow");
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
	text("Welcome to Title Here!", width / 2, height / 3);
	pop();

	// credits and brief intro
	push();
	textSize(25);
	rectMode(CENTER);
	text("A game by Crikey!", width / 2, 325);
	text("Many hands make light work!", width / 2, 450);
	text("Work with your \"roommate\" to check off the to-do list items and tidy the room.", width / 2, 460, 530);
	text("Press any button to continue >>>", width / 2, 650);
	pop();
}

function drawMain() {
	background(roomImg);

	// hovers
	for (const guest of guests) {
		// table
		if (guest.x > 80 && guest.x < 400 && guest.y > 435 && guest.y < 700) {
			image(tableHighlightImg, 81, 435, 307, 307);
			if (mouseIsPressed) {
				shared.gameState = "table-game";
			}
		}
		// window
		 else if (guest.x > 170 && guest.x < 300 && guest.y > 120 && guest.y < 200) {
			image(windowHighlightImg, 172, 101, 131, 131);
			if (mouseIsPressed) {
				shared.gameState = "window-game";
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

	// push();
	// stroke("red");
	// strokeWeight(20);
	// noFill();
	// rect(228, 160, 162, 135, 2);
	// pop();

	push();
	angleMode(DEGREES);
	stroke("green");
	strokeWeight(20);
	noFill();
	rotate(45);
	rect(550, -300, 105, 132, 2);
	pop();

	push();
	angleMode(DEGREES);
	stroke("purple");
	strokeWeight(20);
	noFill();
	rotate(45);
	rect(540, -80, 105, 132, 2);
	pop();

	if (partyIsHost()) {
		shared.sprites.push(initSprite("a", new Rect(228, 160, 162, 135), "red"));

		shared.sprites.forEach(stepSprite);
		shared.sprites.forEach(drawSprite);
	}
}

function mousePressed() {
	for (const s of shared.sprites.slice().reverse()) {
		if (mousePressedSprite(s)) break;
	}
}

function mouseReleased() {
	for (const s of shared.sprites.slice().reverse()) {
		if (mouseReleasedSprites(s)) break;
	}
}

function initSprite(id, rect = new Rect(), color = "red") {
	const s = {};
	s.id = id;
	s.rect = rect;
	s.color = color;
	return s;
}

function drawSprite(s) {
	push();
	fill(s.color);
	noStroke();
	rect(s.rect.l, s.rect.t, s.rect.w, s.rect.h);
	pop();
}

function stepSprite(s) {
	if (s.inDrag && s.owner === my_id) {
		// create new rect
		const rect = new Rect(
			mouseX + s.dragOffset.x,
			mouseY + s.dragOffset.y,
			s.rect.w,
			s.rect.h,
		);

		// update
		partyEmit("updateSprite", {
			id: s.id,
			updates: { rect },
		});
	}
}

function mousePressedSprite(s) {
	if (!s.inDrag && pointInRect(new Point(mouseX, mouseY), s.rect)) {
		partyEmit("updateSprite", {
			id: s.id,
			updates: {
				inDrag: true,
				owner: my_id,
				dragOffset: new Point(s.rect.l - mouseX, s.rect.t - mouseY),
			},
		});
		return true;
	}
	return false;
}

function mouseReleasedSprite(s) {
	if (s.owner === my_id) {
		partyEmit("updateSprite", {
			id: s.id,
			updates: {
				inDrag: false,
				owner: null,
			},
		});
	}
	return false;
}

function drawWindowGame() {
	background("#f2f2f2");
	windowFullImg.resize(700, 500);
	image(windowFullImg, 50, 150);
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