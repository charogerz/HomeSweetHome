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
let g;
let checklistImg;
let checkmark;
let tableHighlightImg, tableFullImg;
let tableTask;
let windowHighlightImg, windowFullImg;
let windowTask;
let hostClickCount, guestClickCount;

function preload() {
	partyConnect("wss://demoserver.p5party.org", "team1_gameB");
	guests = partyLoadGuestShareds();
	my = partyLoadMyShared();
	shared = partyLoadShared("globals", {
		gameState: "intro",
		windowTask: "false",
		tableTask: "false",
		hostClickCount: 0,
		guestClickCount: 0
	});
	roomImg = loadImage("./assets/images/room-layout.png");
	checklistImg = loadImage("./assets/images/todo-list.png");
	tableHighlightImg = loadImage("./assets/images/table-highlight.png");
	tableFullImg = loadImage("./assets/images/dining-table.png");
	windowHighlightImg = loadImage("./assets/images/window-highlight.png");
	windowFullImg = loadImage("./assets/images/window.png");
	checkmark = loadImage("./assets/images/checkmark.png");
}

function setup() {
	createCanvas(800, 800);

	// graphics for window mess
	g = createGraphics(800, 800);
	g.fill("#bde7fc");
	g.noStroke();
	g.ellipse(300, 350, 400, 300);
	g.ellipse(500, 420, 400, 300);
	g.ellipse(320, 470, 300, 200);


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
	// Comic Sans! Can change :]
	textFont("Comic Sans MS");
	textAlign(CENTER);
	textStyle(BOLD);
	fill("#000066");

	// title
	push();
	textSize(50);
	text("Home Sweet Home!", width / 2, height / 3);
	pop();

	// credits and brief intro
	push();
	textSize(25);
	rectMode(CENTER);
	text("Welcome to another game by Crikey!", width / 2, 325);
	text("Many hands make light work!", width / 2, 450);
	text(
		'Work with your "roommate" to check off the to-do list items and tidy the room.',
		width / 2,
		460,
		530
	);
	text("Press any button to continue >>>", width / 2, 650);
	pop();
}

function drawMain() {
	background(roomImg);

	// checklist button
	push();
	noFill();
	stroke("#000066");
	strokeWeight(5);
	rect(305, 725, 200, 50, 20);
	pop();
	push();
	textSize(20);
	fill("#000066");
	text("click for checklist", 405, 755);
	pop();

	// hovers
	for (const guest of guests) {
		// table
		if (guest.x > 80 && guest.x < 400 && guest.y > 435 && guest.y < 700) {
			image(tableHighlightImg, 81, 435, 307, 307);
			if (shared.windowTask === "true") {
				image(windowHighlightImg, 172, 101, 131, 131);
				image(checkmark, 205, 112, 60, 70);
			}
			if (mouseIsPressed) {
				shared.gameState = "table-game";
			}
			return;
		}
		// window
		if (guest.x > 170 && guest.x < 300 && guest.y > 120 && guest.y < 200 && shared.windowTask === "false") {
			image(windowHighlightImg, 172, 101, 131, 131);
			if (mouseIsPressed) {
				shared.gameState = "window-game";
			}
			return;
		}
		if (shared.windowTask === "true") {
			image(windowHighlightImg, 172, 101, 131, 131);
			image(checkmark, 205, 112, 60, 70);
		}
		// checklist
		if (guest.x > 305 && guest.x < 505 && guest.y > 725 && guest.y < 775 && mouseIsPressed) {
			image(checklistImg, 200, 80, 400, 650);
			push();
			fill("#000066");
			textSize(25);
			text("- wipe the window", 400, 290);
			text("- clean the table", 395, 340);
			pop();
		}
	}
}

function drawTableGame() {
	background("#f2f2f2");
	tableFullImg.resize(1000, 800);
	image(tableFullImg, -100, 90);

	// tabletop covering orig image
	push();
	fill("#f2f2f2");
	noStroke();
	rect(120, 145, 567, 480);
	pop();

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
			s.rect.h
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

	// instructions
	fill("#000066");
	textSize(30);
	text("Roommate 1: click to add suds", 350, 60);
	text("Roommate 2: click to wipe away", 360, 90);

	// window
	windowFullImg.resize(700, 500);
	image(windowFullImg, 50, 150);

	// mess to clean
	image(g, 0, 0);

	if (shared.hostClickCount >= 16 && shared.guestClickCount >= 10) {
		shared.windowTask = "true";
		shared.gameState = "playing";
	} else return;

	// done button
	push();
	fill("#f2f2f2");
	stroke("#000066");
	strokeWeight(5);
	rect(305, 725, 200, 50, 20);
	pop();
	push();
	textSize(20);
	fill("#000066");
	text("finished task!", 405, 755);
	pop();

	for (const guest of guests) {
		if (guest.x > 305 && guest.x < 505 && guest.y > 725 && guest.y < 775 && mouseIsPressed) {
			shared.windowTask = "true";
			shared.gameState = "playing";
		}
	}
}

function mouseClicked() {
	// window cleaning functions
	if (shared.gameState === "window-game") {
		if (partyIsHost()) {
			g.fill("#ff9eed");
			g.ellipse(my.x, my.y, 60);
			shared.hostClickCount += 1;
		} else {
			g.erase();
			g.ellipse(my.x, my.y, 120);
			shared.guestClickCount += 1;
		}
	}
}

////////// IGNORE BELOW, KEEPING CODE NOTES FOR LATER


// MULTICOLOR DRAG AND DRAW, MAYBE USEFUL?
// function draw() {

// 	if (mouseIsPressed === true) {
// 	  ellipse(mouseX, mouseY, 15,20,30);
// 	  // fill("#dfeed3")
// 	  // rect(mouseX, mouseY, 15,20,30);
// 	  fill(225, random(225), random(225));
// 	}
//   }
