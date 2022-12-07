
let gameIsOver = false;
//brick data
let brickColumns = 20;
let brickRows = 5;
let brickWidth, brickHeight;
let brickColors = ["red", "orange", "green", "blue", "purple"];
let bricks = [];
//paddle data
let paddle = {
    name: "paddle",
    pos: {
        x: 0,
        y: 0
    },
    height: 20,
    width: 200,
    color: "white",
    draw: function() {
        fill(this.color);
        rect(this.pos.x, this.pos.y, this.width, this.height);
    }
}
//ball data
let ball = {
    name: "ball",
    lives: 3,
    pos: {
        x: 0,
        y: 0
    },
    vel: {
        x: 0,
        y: 0
    },
    radius: 10,
    color: "white",
    isSpawned: false,
    update: function() {
        ball.pos.y += ball.vel.y;
        ball.pos.x += ball.vel.x;

        //check sides
        if(ball.pos.x - ball.radius <= 0) ball.vel.x = -ball.vel.x;
        if(ball.pos.x + ball.radius >= windowWidth) ball.vel.x = -ball.vel.x;
        if(ball.pos.y - ball.radius <= 0) ball.vel.y = -ball.vel.y;
        if(ball.pos.y + ball.radius >= windowHeight) {
            ball.lives--;
            ball.isSpawned = false;
            if(ball.lives < 0) gameOver("You lose!");
        }

        ball.checkCollision(paddle);

        //check bricks
        let idx_marker;
        for(let i = 0; i < bricks.length; i++) {
            //the check collision method will return true if we find a collision, 
            //if we collide with multiple entities at once it will react to both
            //entities, resulting in a collision anyways.
            if(ball.checkCollision(bricks[i])) {
                idx_marker = i;
                break;
            }
        };
        if(idx_marker != undefined) bricks.splice(idx_marker, 1);
        if(bricks.length == 0) gameOver("You Win!");
    },
    checkCollision: function(entity) {
        //the nearest point on the entity to the ball
        let nearestX = Math.max(entity.pos.x, Math.min(ball.pos.x, entity.pos.x + entity.width));
        let nearestY = Math.max(entity.pos.y, Math.min(ball.pos.y, entity.pos.y + entity.height));

        let x_dist = ball.pos.x - nearestX;
        let y_dist = ball.pos.y - nearestY;

        let isColliding = (x_dist * x_dist + y_dist * y_dist) < (ball.radius * ball.radius);
        if(isColliding) {
            if(entity.name == "paddle") {
                ball.vel.y = -ball.vel.y;
                ball.vel.x = -((entity.pos.x + entity.width / 2) - ball.pos.x) * 0.1;
            }
            if(entity.name == "brick") {
                console.log(y_dist, x_dist);
                if(x_dist == 0) ball.vel.y = -ball.vel.y;
                if(y_dist == 0) ball.vel.x = -ball.vel.x;
            }
            console.log(ball.vel.y < 0);
            return true;
        }
        return false;
    },
    draw: function() {
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.radius * 2);
    },
    spawn: function() {
        ball.pos.x = mouseX;
        ball.pos.y = mouseY;
        ball.isSpawned = true;
        ball.vel.y = 5;
    }
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    brickWidth = Math.floor(windowWidth / brickColumns);
    windowWidth = brickColumns * brickWidth;
    brickHeight = Math.floor(windowHeight * 0.05);
    paddle.pos.y = windowHeight - 30;

    //populate bricks
    for(let i = 0; i < brickColumns; i++) {
        for(let j = 0; j < brickRows; j++) {
            bricks.push({
                name: "brick",
                pos: {
                    x: i * brickWidth,
                    y: j * brickHeight
                },
                width: brickWidth,
                height: brickHeight,
                color: brickColors[Math.floor(Math.random() * brickColors.length)]
            });
        }
    }

}
function draw() {
    paddle.pos.x = mouseX - (paddle.width / 2);
    background(0);

    paddle.draw();
    bricks.forEach(function(brick) {
        fill(brick.color);
        rect(brick.pos.x, brick.pos.y, brick.width, brick.height);
    });
    if(ball.isSpawned){ 
        ball.update();
        ball.draw();
    }
    for(let i = 0; i < ball.lives; i++) {
        fill(ball.color);
        circle(20 + (3 * ball.radius * i), ball.radius + 10, 2 * ball.radius);
    }
}
function mouseClicked() {
    let isWithinBounds = false;
    if((ball.radius < mouseX && mouseX < windowWidth - ball.radius) && (brickRows * brickHeight < mouseY && mouseY < paddle.pos.y)) isWithinBounds = true;

    if(ball.isSpawned == false && isWithinBounds) {
        
        ball.spawn();
        ball.vel.x = 0;
        ball.vel.y = 5;
    }
}
function gameOver(display_text) {
    gameIsOver = true;
    noLoop();
    background(0);
    
    for(let i = 0; i < windowWidth / 50; i++) {
        for(let j = 0; j < windowHeight / 50; j++) {
            fill(brickColors[Math.floor(Math.random() * brickColors.length)]);
            square(i * 50, j * 50, 50);
        }
    }
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(64);
    text(display_text, windowWidth / 2, windowHeight / 2);
}