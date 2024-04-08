// GameB from Team One - Charlotte, Chloe, and Emma

let shapes = [];

function preload() {
    partyConnect("wss://demoserver.p5party.org", "team1_gameB");
}

function setup() {
    createCanvas(500, 500);
}

function draw() {
    background("#f2f2f2");

    // screen divider
    line(width/2, 0, width/2, height);

    // left shape
    fill("red");
    ellipse(width/4, height/2, 100);

    // right shape
    fill("blue");
    ellipse(width-125, height/2, 100);
}