var size = 20;
var fps = 20;
function Snake() {
    this.pos = {
        x: 0,
        y: 0
    };
    this.color = "green";
    this.body = [{x:0,y:0}];
    this.direction;
    this.vel = {
        x: 0,
        y: 0
    };
    this.isGrowing = false;
    this.init = function(x, y) {
        this.pos.x = x - (x % size);
        this.pos.y = y - (y % size);
    };
    this.update = function() {

        //save the current position to propagate down the body
        let previous_x = this.pos.x;
        let previous_y = this.pos.y;

        //increment position based on velocity
        this.pos.x += this.vel.x * size;
        this.pos.y += this.vel.y * size;
        
        //adjust for screen boundaries
        if(this.pos.x > windowWidth) this.pos.x = 0;
        if(this.pos.y > windowHeight) this.pos.y = 0;
        if(this.pos.x < 0) {this.pos.x = windowWidth - (windowWidth % size) + size;}
        if(this.pos.y < 0) this.pos.y = windowHeight - (windowHeight % size) + size;

        //update the first body segment
        this.body[0].x = this.pos.x;
        this.body[0].y = this.pos.y;

        //check if we need to add a segment
        if(this.isGrowing) {
            this.body.push({x: 0, y: 0});
            this.isGrowing = false;
        }

        //propogate previous locations
        this.body.forEach(function(segment, idx) { //keep swapping the previous positions into the next body segment.
            if(idx == 0) return;
            let x_bucket = segment.x;
            let y_bucket = segment.y;
            segment.x = previous_x;
            segment.y = previous_y;
            previous_x = x_bucket;
            previous_y = y_bucket;
        });

        //check for collision
        this.checkCollision();

    };
    this.checkCollision = function() {
        for(let i = 1; i < this.body.length; i++) {
            if(this.pos.x == this.body[i].x && this.pos.y == this.body[i].y) gameOver();
        }
    }
    this.checkFood = function(food) {
        let deletion_idx; //the index of the food to delete, so we can remove it after we loop through and do what we need to do.
        for(let i = 0; i < food.length; i++) {
            let item = food[i];
            if(this.pos.x == item.x && this.pos.y == item.y) {
                this.isGrowing = true;
                deletion_idx = i;
            }
        }
        if(this.isGrowing) {
            food.splice(deletion_idx, 1);
            food.push(new Food());
        }
    };
    this.draw = function() {
        fill(this.color);
        for(let i = 0; i < this.body.length; i++) {
            square(this.body[i].x, this.body[i].y, size);
        }
    };
    this.setDirection = function(direction) {
        //cancel the direction update if it means collision with self
        if((direction == "up" || direction == "down") && (this.direction == "up" || this.direction == "down")) return;
        if((direction == "left" || direction == "right") && (this.direction == "left" || this.direction == "right")) return;
        
        switch(direction) {
            case "up":
                this.vel.x = 0;
                this.vel.y = -1;
                break;
            case "down":
                this.vel.x = 0;
                this.vel.y = 1;
                break;
            case "left":
                this.vel.x = -1;
                this.vel.y = 0;
                break;
            case "right":
                this.vel.x = 1;
                this.vel.y = 0;
                break;
        }
        this.direction = direction;
    };
};

let snake = new Snake();
let Food = function(x, y) {
    let rand_x = Math.floor(Math.random() * windowWidth);
    let rand_y = Math.floor(Math.random() * windowHeight);
    this.x = rand_x - (rand_x % size);
    this.y = rand_y - (rand_y % size);
    this.color = "red";
}
let food = [];
let gameUpdateInterval;
function setup() {
    createCanvas(windowWidth, windowHeight);
    snake.init(windowWidth / 2, windowHeight / 2);
    food.push(new Food());
    gameUpdateInterval = setInterval(function() {
        snake.update();
        snake.checkFood(food);
        redraw();
    }, 1000/fps);

    noLoop();
}

function draw() {
    background(0);
    food.forEach(function(item) {
        fill(item.color);
        square(item.x, item.y, size);
    });
    snake.draw();
}

function keyPressed() {
    
    switch(keyCode) {
        case 87: //w
            snake.setDirection("up");
            break;
        case 65: //a
            snake.setDirection("left");
            break;
        case 83: //s   
            snake.setDirection("down");
            break;
        case 68: //d
            snake.setDirection("right");
            break;
    }
}

function gameOver() {
    snake.color = "orange";
    clearInterval(gameUpdateInterval);
}