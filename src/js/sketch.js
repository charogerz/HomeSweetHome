// GameB from Team One - Charlotte, Chloe, Sophie, and Emma

// Using code snippets from p5party's drag_fix_3 
// https://p5party.org/examples/drag_fix_3/

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
let soapShared, wipeShared;
let my, guests;
let cursor;
let titleScreen;
let roomImg;
let g;
let checklistImg;
let checkmark;
let tableHighlightImg, tableFullImg;
let redGoalX, redGoalY, blueGoalX, blueGoalY;
let radius;
let red1X, red1Y, red2X, red2Y;
let blue1X, blue1Y, blue2X, blue2Y;
let redGoalDone, blueGoalDone;
let tableTask;
let windowHighlightImg, windowFullImg;
let windowTask;
let cleanPixels;

function preload() {
	partyConnect("wss://demoserver.p5party.org", "team1_gameB");
	guests = partyLoadGuestShareds();
	my = partyLoadMyShared();
	shared = partyLoadShared("globals", {
		gameState: "intro",
		windowTask: "false",
		redGoalDone: "false",
		blueGoalDone: "false",
		tableTask: "false"
	});
	soapShared = partyLoadShared("soap", { locations: []});
	wipeShared = partyLoadShared("wipe", { locations: []});

	// loading all images
    titleScreen = loadImage("./assets/images/title.gif");
	roomImg = loadImage("./assets/images/room-layout.png");
	cursor = loadImage("./assets/images/cursor.png");
	checklistImg = loadImage("./assets/images/todo-list.png");
	tableHighlightImg = loadImage("./assets/images/table-highlight.png");
	tableFullImg = loadImage("./assets/images/dining-table.png");
	windowHighlightImg = loadImage("./assets/images/window-highlight.png");
	windowFullImg = loadImage("./assets/images/window.png");
	checkmark = loadImage("./assets/images/checkmark.png");
}

function setup() {
	createCanvas(800, 800);

	// table game goals
	redGoalX = 640;
	redGoalY = 170;
	blueGoalX = 155;
	blueGoalY = 610;
	radius = 80;

	// graphics buffer for window mess
	g = createGraphics(800, 800);
	g.fill("#bde7fc");
	g.noStroke();
	g.ellipse(260, 300, 300, 200);
	g.ellipse(500, 350, 400, 300);
	g.ellipse(350, 470, 480, 240);
	g.ellipse(500, 490, 400, 230);

	// initializing rects on table
	if (partyIsHost()) {
		shared.sprites = [];
		shared.sprites.push(initSprite("a", new Rect(200, 160, 162, 125), "red"));
		shared.sprites.push(initSprite("b", new Rect(240, 450, 105, 132), "red"));
		shared.sprites.push(initSprite("c", new Rect(385, 260, 105, 132), "blue"));
		shared.sprites.push(initSprite("d", new Rect(510, 320, 155, 132), "blue"));
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

	
	if (shared.tableTask === "true" && shared.windowTask === "true") {
		drawEnd();
	}

	// player cursors
	for (const guest of guests) {
		image(cursor, guest.x, guest.y);
	}
}

function drawIntro() {
	background("#000000");
	image(titleScreen, 0, 0, width, height);
	// commit update
	textFont("Comic Sans MS");
	textAlign(CENTER);
	textStyle(BOLD);
	fill("#000066");

	// title
		// push();
		// textSize(50);
		// text("Home Sweet Home!", width / 2, height / 3);
		// pop();

	// credits and brief intro
		// push();
		// textSize(25);
		// rectMode(CENTER);
		// text("Welcome to another game by Crikey!", width / 2, 325);
		// text("Many hands make light work!", width / 2, 450);
		// text(
		// 	'Work with your "roommate" to check off the to-do list items and tidy the room.',
		// 	width / 2,
		// 	460,
		// 	530
		// );
		// text("Press any key to continue >>>", width / 2, 650);
		// pop();
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
		if (guest.x > 80 && guest.x < 400 && guest.y > 435 && guest.y < 700 && shared.tableTask === "false") {
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
			if (shared.tableTask === "true") {
				image(tableHighlightImg, 81, 435, 307, 307);
				image(checkmark, 200, 505, 70, 80);
			}
			if (mouseIsPressed) {
				shared.gameState = "window-game";
			}
			return;
		}
		if (shared.windowTask === "true") {
			image(windowHighlightImg, 172, 101, 131, 131);
			image(checkmark, 205, 112, 60, 70);
		}
		if (shared.tableTask === "true") {
			image(tableHighlightImg, 81, 435, 307, 307);
			image(checkmark, 200, 505, 70, 80);
		}
		// checklist
		if (guest.x > 305 && guest.x < 505 && guest.y > 725 && guest.y < 775 && mouseIsPressed) {
			image(checklistImg, 200, 180, 400, 550);
			push();
			fill("#000066");
			textSize(25);
			text("- wipe the window", 400, 360);
			text("- clean the table", 395, 400);
			pop();
			if (shared.windowTask === "true") {
				image(checkmark, 287, 330, 25, 30);
			}
			if (shared.tableTask === "true") {
				image(checkmark, 287, 370, 25, 30);
			}
		}
	}
}

function drawEnd() {
	background("#f2f2f2");
	push();
	image(checkmark, 350, 100, 150, 180);
	fill("#000066");
	textSize(50);
	text("You did it!", width/2, height/2);
	text("Congrats, roomies!", width/2, 480);
	textSize(30);
	text("Ctrl + R to play again", width/2, 700);
	pop();
}

function drawTableGame() {
	background("#f2f2f2");
	tableFullImg.resize(1000, 800);
	image(tableFullImg, -100, 90);
	noStroke();

	// instructions
	fill("#000066");
	textSize(30);
	text("Roommate 1: sort the red items", 400, 50);
	text("Roommate 2: sort the blue items", 405, 80);


	// tabletop with designated goal areas
	fill("#f2f2f2");
	rect(120, 145, 569, 480, 20);
	// red goal
	fill(255, 0, 0, 127);
	ellipse(redGoalX, redGoalY, radius);
	fill("#000066")
	textSize(14);
	text("red here", 640, 175);
	// blue goal
	fill(0, 0, 255, 127);
	ellipse(blueGoalX, blueGoalY, radius);
	fill("black")
	textSize(14);
	text("blue here", 155, 615);

	shared.sprites.forEach(stepSprite);
	shared.sprites.forEach(drawSprite);

	checkTableItems();
	if (shared.redGoalDone === "true" && shared.blueGoalDone === "true") {
		shared.tableTask = "true";
		shared.gameState = "playing";
	}
}

function checkTableItems() {
	red1X = shared.sprites[0].rect.l;
	red1Y = shared.sprites[0].rect.t;
	red2X = shared.sprites[1].rect.l;
	red2Y = shared.sprites[1].rect.t;
	blue1X = shared.sprites[2].rect.l;
	blue1Y = shared.sprites[2].rect.t;
	blue2X = shared.sprites[3].rect.l;
	blue2Y = shared.sprites[3].rect.t;
	
	if (dist(red1X, red1Y, redGoalX, redGoalY) < 110 && dist(red2X, red2Y, redGoalX, redGoalY) < 110) {
		shared.redGoalDone = "true";
	}
	if (dist(blue1X, blue1Y, blueGoalX, blueGoalY) < 110 && dist(blue2X, blue2Y, blueGoalX, blueGoalY) < 110) {
		shared.blueGoalDone = "true";
	}
}

function mousePressed() {
	for (const s of shared.sprites.slice().reverse()) {
		if (mousePressedSprite(s)) break;
	}
}

function mouseReleased() {
	for (const s of shared.sprites.slice().reverse()) {
		if (mouseReleasedSprite(s)) break;
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
	text("Roommate 1: click to add soap", 350, 60);
	text("Roommate 2: click to wipe away", 360, 90);
	text("dirt behind soap", 448, 120);

	// wipe away with erase
	g.push();
	g.erase();
	for (const location of wipeShared.locations) {
		g.ellipse(location.x, location.y, 100, 100);
	}
	g.noErase();
	g.pop();

	// calculate amount cleaned
	cleanPixels = 0;
	g.loadPixels();
	for (let i = 3; i < g.pixels.length; i += 4) {
		if (g.pixels[i] === 0) {
     		cleanPixels++;
		}
	}
	g.updatePixels();

	// window
	windowFullImg.resize(700, 500);
	image(windowFullImg, 50, 150);

	// "dirt" to clean on window
	image(g, 0, 0);

	// draw soap
	for (const location of soapShared.locations) {
		fill("#ff9eed");
		ellipse(location.x, location.y, 40, 40);
	}

	// percent cleaned
	fill("black");
	const totalPixels = 800 * 800 * pixelDensity() * pixelDensity();
	let percentCleaned = (cleanPixels / totalPixels) * 100;
	
	// percentage cleaned in top left corner, for testing
	// textSize(20);
	// text(`Cleaned: ${floor(percentCleaned)}`, 80, 25);

	// check percent cleaned, complete task
	if (percentCleaned >= 95) {
		shared.windowTask = "true";
		shared.gameState = "playing";
	}
}

function mouseClicked() {
	// window cleaning functions
	if (shared.gameState === "window-game") {
		if (partyIsHost()) {
			soapShared.locations.push({ x: mouseX, y: mouseY });
		} else {
			if (soapShared.locations.find((location) => dist(location.x, location.y, mouseX, mouseY) < 20))
			{wipeShared.locations.push({ x: mouseX, y: mouseY })};
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
