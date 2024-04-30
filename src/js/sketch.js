// Home Sweet Home, a game from Crikey - members Charlotte, Chloe, Emma, and Sophie

// Work with your "roommate" to check off the to-do list items and tidy the room!
// Cooperative cozy game for two players, using only the mouse to point, click, and drag items

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

// image array
let images = [];

// shared variables
let shared;
let soapShared, wipeShared;
let waterShared;
let my, guests;

// graphic layer for window game
let gWindow;

// graphic layer for plant game
let gPlant;

// pixels cleaned in window game
let cleanPixels;

// table item variables
let redGoalX, redGoalY, blueGoalX, blueGoalY;
let radius;
let red1X, red1Y, red2X, red2Y;
let blue1X, blue1Y, blue2X, blue2Y;

function preload() {
	partyConnect("wss://demoserver.p5party.org", "team1_gameB");
	guests = partyLoadGuestShareds();
	my = partyLoadMyShared();
	shared = partyLoadShared("globals", {
		gameState: "intro",
		windowTask: false,
		redGoalDone: false,
		blueGoalDone: false,
		tableTask: false,
		plantTask: false
	});
	soapShared = partyLoadShared("soap", { locations: []});
	wipeShared = partyLoadShared("wipe", { locations: []});
	waterShared = partyLoadShared("water", { locations: [] });

	// loading all images
    images.titleScreen = loadImage("./assets/images/title.gif");
	images.room = loadImage("./assets/images/room-layout.png");
	images.cursor = loadImage("./assets/images/cursor.png");
	images.tableHighlight = loadImage("./assets/images/table-highlight.png");
	images.tableZoom = loadImage("./assets/images/dining-table.png");
	images.windowHighlight = loadImage("./assets/images/window-highlight.png");
	images.windowZoom = loadImage("./assets/images/window.png");
	images.checkmark = loadImage("./assets/images/checkmark.png");
	images.plantHighlight = loadImage("./assets/images/plant-highlight.png");
	images.plantZoom = loadImage("./assets/images/plant.png");
}

function setup() {
	createCanvas(800, 800);

	noCursor();

	// table game goals
	redGoalX = 640;
	redGoalY = 170;
	blueGoalX = 155;
	blueGoalY = 610;
	radius = 80;

	// graphics buffer for window mess
	gWindow = createGraphics(800, 800);
	gWindow.fill("#bde7fc");
	gWindow.noStroke();
	gWindow.ellipse(260, 300, 300, 200);
	gWindow.ellipse(500, 350, 400, 300);
	gWindow.ellipse(350, 470, 480, 240);
	gWindow.ellipse(500, 490, 400, 230);

	// graphics buffer for plant dirt and bark
	gPlant = createGraphics(800, 800);
	gPlant.fill("#9e5c21");
	gPlant.noStroke();
	gPlant.rect(350, 500, 160, 85, 24);
	gPlant.rect(365, 410, 80, 100, 18);

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

function mouseDragged(e) {
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
	textFont("Comic Sans MS");
	textAlign(CENTER);
	textStyle(BOLD);
	fill("#000066");

	if (shared.gameState === "intro") {
		drawIntro();
	} else if (shared.gameState === "main") {
		drawMain();
	} else if (shared.gameState === "table-game") {
		drawTableGame();
	} else if (shared.gameState === "window-game") {
		drawWindowGame();
	} else if (shared.gameState === "plant-game") {
		drawPlantGame();
	} else if (shared.gameState === "end") {
		drawEnd();
	}

	// checks for button clicked on intro
	if (shared.gameState === "intro" && keyIsPressed) {
		shared.gameState = "main";
	}

	// checks for end game by checking each mini game task
	if (shared.tableTask && shared.windowTask && shared.plantTask) {
		shared.gameState = "end";
	}

	// draw player cursors
	for (const guest of guests) {
		image(images.cursor, guest.x, guest.y);
	}
}

function drawIntro() {
	background("#000000");
	image(images.titleScreen, 0, 0, width, height);
}

function drawMain() {
	background(images.room);

	// checklist
	push();
	fill(98, 98, 166, 120);
	stroke("#000066");
	strokeWeight(5);
	rect(530, 0, 230, 135, 3);
	pop();
	push();
	fill("#000066");
	textSize(20);
	textAlign(LEFT);
	text("TO-DO:", 550, 30);
	text("- wipe the window", 550, 60);
	text("- clean the table", 550, 90);
	text("- care for the plant", 550, 120);
	pop();
	if (shared.windowTask) {
		image(images.checkmark, 550, 38, 20, 20);
	}
	if (shared.tableTask) {
		image(images.checkmark, 550, 68, 20, 20);
	}
	if (shared.plantTask) {
		image(images.checkmark, 550, 98, 20, 20);
	}

	// hovers
	for (const guest of guests) {
		// table
		if (guest.x > 80 && guest.x < 400 && guest.y > 435 && guest.y < 700 && shared.tableTask === false) {
			image(images.tableHighlight, 81, 435, 307, 307);
			if (shared.windowTask && shared.plantTask === false) {
				image(images.windowHighlight, 172, 101, 131, 131);
				image(images.checkmark, 205, 112, 60, 70);
			} else if (shared.plantTask && shared.windowTask === false) {
				image(images.plantHighlight, 681, 631, 149, 152);
				image(images.checkmark, 730, 680, 50, 50);
			} else if (shared.plantTask && shared.windowTask) {
				image(images.plantHighlight, 681, 631, 149, 152);
				image(images.checkmark, 730, 680, 50, 50);

				image(images.windowHighlight, 172, 101, 131, 131);
				image(images.checkmark, 205, 112, 60, 70);
			}
			if (mouseIsPressed) {
				shared.gameState = "table-game";
			}
			return;
		}
		// window
		if (guest.x > 170 && guest.x < 300 && guest.y > 120 && guest.y < 200 && shared.windowTask === false) {
			image(images.windowHighlight, 172, 101, 131, 131);
			if (shared.tableTask && shared.plantTask === false) {
				image(images.tableHighlight, 81, 435, 307, 307);
				image(images.checkmark, 200, 505, 70, 80);
			} else if (shared.plantTask && shared.tableTask === false) {
				image(images.plantHighlight, 681, 631, 149, 152);
				image(images.checkmark, 730, 680, 50, 50);			
			} else if (shared.plantTask && shared.tableTask) {
				image(images.plantHighlight, 681, 631, 149, 152);
				image(images.checkmark, 730, 680, 50, 50);

				image(images.tableHighlight, 81, 435, 307, 307);
				image(images.checkmark, 200, 505, 70, 80);
			}
			if (mouseIsPressed) {
				shared.gameState = "window-game";
			}
			return;
		}
		// plant
		if (guest.x > 700 && guest.x < 800 && guest.y > 620 && guest.y < 760 && shared.plantTask === false) {
			image(images.plantHighlight, 681, 631, 149, 152);
			if (shared.tableTask && shared.windowTask === false) {
				image(images.tableHighlight, 81, 435, 307, 307);
				image(images.checkmark, 200, 505, 70, 80);
			} else if (shared.windowTask && shared.tableTask === false) {
				image(images.windowHighlight, 172, 101, 131, 131);
				image(images.checkmark, 205, 112, 60, 70);
			} else if (shared.windowTask && shared.tableTask) {
				image(images.tableHighlight, 81, 435, 307, 307);
				image(images.checkmark, 200, 505, 70, 80);

				image(images.windowHighlight, 172, 101, 131, 131);
				image(images.checkmark, 205, 112, 60, 70);
			}
			if (mouseIsPressed) {
				shared.gameState = "plant-game";
			}
			return;
		}

		// remove hover from completed sections
		if (shared.windowTask) {
			image(images.windowHighlight, 172, 101, 131, 131);
			image(images.checkmark, 205, 112, 60, 70);
		}
		if (shared.tableTask) {
			image(images.tableHighlight, 81, 435, 307, 307);
			image(images.checkmark, 200, 505, 70, 80);
		}
		if (shared.plantTask) {
			image(images.plantHighlight, 681, 631, 149, 152);
			image(images.checkmark, 730, 680, 50, 50);
		}
	}
}

function drawEnd() {
	background("#f2f2f2");
	push();
	image(images.checkmark, 350, 100, 150, 180);
	fill("#000066");
	textSize(50);
	text("You did it!", width/2, height/2);
	text("Congrats, roomies!", width/2, 480);
	textSize(30);
	text("Ctrl + R to play again", width/2, 700);
	pop();
}

function drawPlantGame() {
	background("#f2f2f2");

	// instructions
	push();
	fill("#000066");
	textSize(30);
	textAlign(LEFT);
	text("Roommate 1: water the plant", 150, 40);
	text("Roommate 2: trim branches to prune", 150, 70);
	pop();
	
	// dirt
	image(gPlant, 0, 0);
	
	// plant
	images.plantZoom.resize(450, 670);
	image(images.plantZoom, 200, 90);

	// watering function
	for (const location of waterShared.locations) {
		noStroke();
		fill("blue");
		ellipse(location.x, location.y, 10, 10);
	}
}

function drawTableGame() {
	background("#f2f2f2");
	images.tableZoom.resize(1000, 800);
	image(images.tableZoom, -100, 90);
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
	if (shared.redGoalDone && shared.blueGoalDone) {
		shared.tableTask = true;
		shared.gameState = "main";
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
		shared.redGoalDone = true;
	}
	if (dist(blue1X, blue1Y, blueGoalX, blueGoalY) < 110 && dist(blue2X, blue2Y, blueGoalX, blueGoalY) < 110) {
		shared.blueGoalDone = true;
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
	gWindow.push();
	gWindow.erase();
	for (const location of wipeShared.locations) {
		gWindow.ellipse(location.x, location.y, 100, 100);
	}
	gWindow.noErase();
	gWindow.pop();

	// calculate amount cleaned
	cleanPixels = 0;
	gWindow.loadPixels();
	for (let i = 3; i < gWindow.pixels.length; i += 4) {
		if (gWindow.pixels[i] === 0) {
     		cleanPixels++;
		}
	}
	gWindow.updatePixels();

	// window
	images.windowZoom.resize(700, 500);
	image(images.windowZoom, 50, 150);

	// "dirt" to clean on window
	image(gWindow, 0, 0);

	// draw soap
	for (const location of soapShared.locations) {
		fill("#ff9eed");
		ellipse(location.x, location.y, 40, 40);
	}

	// percent cleaned
	fill("black");
	const totalPixels = 800 * 800 * pixelDensity() * pixelDensity();
	let percentCleaned = (cleanPixels / totalPixels) * 100;

	// check percent cleaned, complete task
	if (percentCleaned >= 95) {
		shared.windowTask = true;
		shared.gameState = "main";
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

	// plant watering functions
	if(shared.gameState === "plant-game") {
		if (partyIsHost()) {
			waterShared.locations.push({ x:mouseX, y: mouseY });
		}
	}
}
