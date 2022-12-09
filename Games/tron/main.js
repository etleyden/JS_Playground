//this array will be a list of all previous locations visited. 
//The format will be a 3D array [numRowsVisited][numColsVisited][actual x, y pair]
var boundaries = [];
var updateInterval;
function Player(color) {
	this.pos = {
			x: 0,
			y: 0
		};
	this.dirName;
	this.direction = {
			x: 0,
			y: 0
		};
	this.isMoving = false;
	this.size = 15;
	this.color = color;
	this.update = function() {
		this.pos.x += this.direction.x * this.size;
		this.pos.y += this.direction.y * this.size;

		//loop around to the other side when you leave the screen
		if(this.pos.y > windowHeight) this.pos.y = 0;
		if(this.pos.x > windowWidth) this.pos.x = 0;

		//the next allowable position OUTSIDE of the window, in order to avoid having gaps on the right and bottom
		if(this.pos.y < 0) this.pos.y = (windowHeight + this.size) - windowHeight % this.size;
		if(this.pos.x < 0) this.pos.x = (windowWidth + this.size) - windowWidth % this.size;
		
		if(this.isMoving) addToBoundaries(this.pos.x, this.pos.y, this);
	};
	this.init = function() {
		let startingX = Math.floor(Math.random() * windowWidth);
		let startingY = Math.floor(Math.random() * windowHeight)
		this.pos.x = startingX - startingX % this.size;
		this.pos.y = startingY - startingY % this.size;
	}
	this.draw = function() {
		fill(this.color);
		square(this.pos.x, this.pos.y, this.size);
	}
	this.updateDirection = function(direction) {
		if((direction == "up" || direction == "down") && (this.dirName == "up" || this.dirName == "down")) return;
		if((direction == "left" || direction == "right") && (this.dirName == "left" || this.dirName == "right")) return;
		switch(direction) {
			case "up":
				this.isMoving = true;
				this.direction.x = 0;
				this.direction.y = -1;
				this.dirName = "up";
				break;
			case "left": //a
				this.dirName = "left";
				this.isMoving = true;
				this.direction.x = -1;
				this.direction.y = 0;
				break;
			case "down": //s
				this.dirName = "down";
				this.isMoving = true;
				this.direction.x = 0;
				this.direction.y = 1;
				break;
			case "right": //d
				this.dirName = "right";
				this.isMoving = true;
				this.direction.x = 1;
				this.direction.y = 0;
				break;
		}
	}
}

var players = [new Player("green"), new Player("blue")];

function setup() {
	createCanvas(windowWidth, windowHeight);

	boundaries = [...Array(windowWidth)].map(e => Array(windowHeight).fill(0));

	//initial position
	players.forEach(p => p.init());

	updateInterval = setInterval(function() {
		players.forEach(p => p.update());
		redraw();
	}, 1000/40);

	background(0);

	noLoop();	
}

function draw() {
	players.forEach(p => p.draw());
}

function addToBoundaries(x, y, player) {
	if(boundaries[x][y]) {
		gameOver(player);
		return;
	}
	boundaries[x][y] = true;
}

function gameOver(player) {
	player.color = "red";
	player.playing = false;
	clearInterval(updateInterval);
}

function keyPressed() {
	console.log(keyCode);
	switch(keyCode) {
		case 87: //W
			players[0].updateDirection("up");
			break;
		case 65: //a
			players[0].updateDirection("left");
			break;
		case 83: //s
			players[0].updateDirection("down");
			break;
		case 68: //d
			players[0].updateDirection("right");
			break;	
		case 38: //up
			players[1].updateDirection("up");
			break;
		case 40: //down
			players[1].updateDirection("down");
			break;
		case 37: //left
			players[1].updateDirection("left");
			break;
		case 39:
			players[1].updateDirection("right");
			break;
	}
	
}