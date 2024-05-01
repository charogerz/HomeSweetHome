// Home Sweet Home, a game from Crikey - members Charlotte, Chloe, Emma, and Sophie

// Work with your "roommate" to check off the to-do list items and tidy the room!
// Cooperative cozy game for two players, using only the mouse to point, click, and drag items

// Using code snippets from p5party's drag_fix_3 
// https://p5party.org/examples/drag_fix_3/

class Rect {
	constructor(l = 0, t = 0, w = 0, h = 0, tx = "") {
		this.l = l;
		this.t = t;
		this.w = w;
		this.h = h;
		this.tx = tx;
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
		plantTask: false,
		cupboardTask: false
	});
	soapShared = partyLoadShared("soap", { locations: [] });
	wipeShared = partyLoadShared("wipe", { locations: [] });
	waterShared = partyLoadShared("water", { locations: [] });

	// loading all images
	images.titleScreen = loadImage("./assets/images/title.gif");
	images.room = loadImage("./assets/images/room.jpg");
	images.cursor = loadImage("./assets/images/cursor-resized.png");
	images.tableZoom = loadImage("./assets/images/table-resized.png");
	images.windowZoom = loadImage("./assets/images/window-resized.png");
	images.checkmark = loadImage("./assets/images/checkmark.png");
	images.plantZoom = loadImage("./assets/images/plant-resized.png");
	images.highlight = loadImage("./assets/images/highlight.png");
	images.cupboardZoom = loadImage("./assets/images/bookshelf-2.png");
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

	// initializing rects on table and cupboard respectively
	if (partyIsHost()) {
		shared.sprites = [];
		shared.sprites.push(initSprite("a", new Rect(200, 160, 162, 125), "red"));
		shared.sprites.push(initSprite("b", new Rect(240, 450, 105, 132), "red"));
		shared.sprites.push(initSprite("c", new Rect(385, 260, 105, 132), "blue"));
		shared.sprites.push(initSprite("d", new Rect(510, 320, 155, 132), "blue"));

		shared.cupSprites = [];
		shared.cupSprites.push(initSprite("t1", new Rect(300, 320, 40, 100, 'top1'), "red"));
		shared.cupSprites.push(initSprite("t2", new Rect(130, 320, 40, 100, 'top2'), "red"));
		shared.cupSprites.push(initSprite("b1", new Rect(255, 320, 40, 100, 'bottom1'), "blue"));
		shared.cupSprites.push(initSprite("b2", new Rect(380, 320, 40, 100, 'bottom2'), "blue"));
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
	const c = shared.cupSprites.find((s) => s.id === id);
	if (!s && !c) return;
	if (s) {
		for (const [k, v] of Object.entries(updates)) {
			s[k] = v;
		}
	}
	if (c) {
		for (const [k, v] of Object.entries(updates)) {
			c[k] = v;
		}
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
	} else if (shared.gameState === "cupboard-game") {
		drawCupboardGame();
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
		image(images.cursor, guest.x, guest.y, 30, 30);
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
	rect(440, 0, 350, 95, 3);
	pop();
	push();
	fill("#000066");
	textSize(20);
	textAlign(LEFT);
	text("TO-DO:", 450, 25);
	text("☐ wipe window", 450, 50);
	text("☐ clear table", 450, 80);
	text("☐ care for plant", 610, 50);
	text("☐ clean cupboard", 610, 80);
	pop();
	if (shared.windowTask) {
		image(images.checkmark, 450, 28, 20, 20);
	}
	if (shared.tableTask) {
		image(images.checkmark, 450, 58, 20, 20);
	}
	if (shared.plantTask) {
		image(images.checkmark, 610, 28, 20, 20);
	}
	if (shared.cupboardTask) {
		image(images.checkmark, 610, 58, 20, 20);
	}

	// hovers
	for (const guest of guests) {
		// table
		if (guest.x > 80 && guest.x < 400 && guest.y > 435 && guest.y < 700 && shared.tableTask === false) {
			push();
			tint(255, 180);
			image(images.highlight, 81, 435, 307, 307);
			pop();
			if (mouseIsPressed) {
				shared.gameState = "table-game";
			}
		}
		// window
		if (guest.x > 170 && guest.x < 300 && guest.y > 120 && guest.y < 200 && shared.windowTask === false) {
			push();
			tint(255, 180);
			image(images.highlight, 175, 80, 131, 131);
			pop();
			if (mouseIsPressed) {
				shared.gameState = "window-game";
			}
		}
		// plant
		if (guest.x > 700 && guest.x < 800 && guest.y > 620 && guest.y < 760 && shared.plantTask === false) {
			push();
			tint(255, 180);
			image(images.highlight, 681, 631, 149, 152);
			pop();
			if (mouseIsPressed) {
				shared.gameState = "plant-game";
			}
		}

		// cupboard
		if (guest.x > 0 && guest.x < 165 && guest.y > 165 && guest.y < 315 && shared.cupboardTask === false) {
			push();
			tint(255, 180);
			image(images.highlight, -30, 115, 230, 230);
			pop();
			if (mouseIsPressed) {
				shared.gameState = "cupboard-game";
			}
		}

		// remove hover from completed sections
		if (shared.windowTask) {
			push();
			tint(255, 180);
			image(images.highlight, 175, 80, 131, 131);
			pop();
			image(images.checkmark, 205, 112, 60, 70);
		}
		if (shared.tableTask) {
			push();
			tint(255, 180);
			image(images.highlight, 81, 435, 307, 307);
			pop();
			image(images.checkmark, 200, 505, 70, 80);
		}
		if (shared.plantTask) {
			push();
			tint(255, 180);
			image(images.highlight, 681, 631, 149, 152);
			pop();
			image(images.checkmark, 730, 680, 50, 50);
		}
		if (shared.cupboardTask) {
			push();
			tint(255, 180);
			image(images.highlight, -30, 115, 230, 230);
			pop();
			image(images.checkmark, 50, 205, 80, 80);
		}
	}
}

function drawEnd() {
	background("#f2f2f2");
	push();
	image(images.checkmark, 350, 100, 150, 180);
	fill("#000066");
	textSize(50);
	text("You did it!", width / 2, height / 2);
	text("Congrats, roomies!", width / 2, 480);
	pop();

	// play again button
	push();
	stroke("#000066");
	strokeWeight(6);
	noFill();
	rect(280, 600, 250, 60, 50);
	pop();
	push();
	textSize(30);
	text("play again", 400, 638);
	pop();
	for (const guest of guests) {
		if (guest.x > 280 && guest.x < 500 && guest.y > 600 && guest.y < 680 && mouseIsPressed) {
			shared.windowTask = false;
			shared.tableTask = false;
			shared.redGoalDone = false;
			shared.blueGoalDone = false;
			shared.plantTask = false;
			shared.cupboardTask = false;
			shared.gameState = "intro";
			setup();
		}
	}
}

function drawPlantGame() {
	background("#f2f2f2");

	// back button 
	push();
	noFill();
	stroke("#000066");
	strokeWeight(5);
	rect(20, 20, 150, 40, 20);
	pop();
	textSize(25);
	text("<<< back", 90, 50);
	for (const guest of guests) {
		if (guest.x > 20 && guest.x < 170 && guest.y > 0 && guest.y < 80 && mouseIsPressed) {
			shared.gameState = "main";
		}
	}

	// instructions
	push();
	fill("#000066");
	textSize(30);
	textAlign(LEFT);
	text("Roommate 1: click to water the plant", 185, 45);
	text("Roommate 2: click to prune branches", 185, 75);
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

	// back button 
	push();
	noFill();
	stroke("#000066");
	strokeWeight(5);
	rect(20, 20, 150, 40, 20);
	pop();
	textSize(25);
	text("<<< back", 90, 50);
	for (const guest of guests) {
		if (guest.x > 20 && guest.x < 170 && guest.y > 0 && guest.y < 80 && mouseIsPressed) {
			shared.gameState = "main";
		}
	}

	// instructions
	fill("#000066");
	textSize(30);
	text("Roommate 1: sort the red items", 430, 40);
	text("Roommate 2: sort the blue items", 435, 70);


	// tabletop with designated goal areas
	fill("#f2f2f2");
	rect(120, 125, 580, 510, 20);
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

function drawCupboardGame() {
	background("#f2f2f2");
	images.cupboardZoom.resize(width, height - 100);
	image(images.cupboardZoom, 0, 90);
	noStroke();

	// back button 
	push();
	noFill();
	stroke("#000066");
	strokeWeight(5);
	rect(20, 20, 150, 40, 20);
	pop();
	textSize(25);
	text("<<< back", 90, 50);
	for (const guest of guests) {
		if (guest.x > 20 && guest.x < 170 && guest.y > 0 && guest.y < 80 && mouseIsPressed) {
			shared.gameState = "main";
		}
	}

	// instructions
	fill("#000066");
	push();
	textSize(30);
	textAlign(LEFT);
	text("Roommate 1: sort the top items", 200, 50);
	text("Roommate 2: sort the bottom items", 200, 80);
	pop();

	shared.cupSprites.forEach(stepSprite);
	shared.cupSprites.forEach(drawSprite);

	let finishFlag = true;
	for (let i = 0; i < shared.cupSprites.length; i++) {
		if (shared.cupSprites[i].rect.l < 90 || shared.cupSprites[i].rect.l > 725) {
			finishFlag = false;
			break;
		}

		if (shared.cupSprites[i].id === 't1' || shared.cupSprites[i].id === 't2') {
			if (shared.cupSprites[i].rect.t < 300 || shared.cupSprites[i].rect.t + 80 > 440) {
				finishFlag = false;
				break;
			}
		}
		if (shared.cupSprites[i].id === 'b1' || shared.cupSprites[i].id === 'b2') {
			if (shared.cupSprites[i].rect.t < 530 || shared.cupSprites[i].rect.t + 80 > 650) {
				finishFlag = false;
				break;
			}
		}
	}

	if (shared.cupSprites[0].rect.l > shared.cupSprites[1].rect.l || shared.cupSprites[2].rect.l > shared.cupSprites[3].rect.l) {
		finishFlag = false;
	}

	if (finishFlag) {
		shared.cupboardTask = true;
		shared.gameState = "main";
	}
}

function mousePressed() {
	for (const s of shared.sprites.slice().reverse()) {
		if (mousePressedSprite(s)) break;
	}
	for (const s of shared.cupSprites.slice().reverse()) {
		if (mousePressedSprite(s)) break;
	}
}

function mouseReleased() {
	for (const s of shared.sprites.slice().reverse()) {
		if (mouseReleasedSprite(s)) break;
	}
	for (const s of shared.cupSprites.slice().reverse()) {
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
	if (s.rect.tx) {
		fill(200)
		textSize(14);
		const t = s.rect.tx.split("")
		for (let i = 0; i < t.length; i++) {
			text(t[i], s.rect.l + 20, s.rect.t + 12 + i * 13)
		}

	}
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
			s.rect.tx
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

	// back button 
	push();
	noFill();
	stroke("#000066");
	strokeWeight(5);
	rect(20, 20, 150, 40, 20);
	pop();
	textSize(25);
	text("<<< back", 90, 50);
	for (const guest of guests) {
		if (guest.x > 20 && guest.x < 170 && guest.y > 0 && guest.y < 80 && mouseIsPressed) {
			shared.gameState = "main";
		}
	}

	// instructions
	fill("#000066");
	textSize(30);
	text("Roommate 1: click to add soap", 440, 60);
	text("Roommate 2: click to wipe away", 450, 90);
	text("dirt behind soap", 538, 120);

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
			if (soapShared.locations.find((location) => dist(location.x, location.y, mouseX, mouseY) < 20)) { wipeShared.locations.push({ x: mouseX, y: mouseY }) }
		}
	}

	// plant watering functions
	if (shared.gameState === "plant-game") {
		if (partyIsHost()) {
			waterShared.locations.push({ x: mouseX, y: mouseY });
			if (waterShared.locations.length >= 15) {
				shared.plantTask = true;
				shared.gameState = "main";
			}
		}
	}
}
