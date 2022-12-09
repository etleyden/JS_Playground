var stars = [];
class Star {
    getAngle(x, y) {
        let opp = (height / 2) - y;
        let adj = (width / 2) - x;
        let angle = Math.atan2(-opp, -adj);
        return angle; 
    }
    constructor () {
        var x = width / 2 - (width * 0.30) + Math.floor(Math.random() * width * 0.60);
        var y = height / 2 - (height * 0.30) + Math.floor(Math.random() * height * 0.60);
        this.x = x;
        this.y = y;
        this.angle = this.getAngle(this.x, this.y);
        this.vector = this.calcSlope(this.x, this.y);
        this.opacity = 0;
        this.timeOnScreen = 0.5;
    };
    isOutOfBounds() {
        return (0 > this.x || this.x > width) || (0 > this.y || this.y > this.height);
    }
    
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0);
    if(stars.length < 1000 && Math.floor(Math.random() * 2) == 1) {
        stars.push(new Star());
        stars.push(new Star());
    } 
    for(var i = 0; i < stars.length; i++) {
        //update star position
        stars[i].timeOnScreen *= 1.03;
        stars[i].y += Math.sin(stars[i].angle) * stars[i].timeOnScreen;
        stars[i].x += Math.cos(stars[i].angle) * stars[i].timeOnScreen;
        if(stars[i].opacity < 255) stars[i].opacity += 4;
        
        //draw star
        fill(stars[i].opacity);
        square(stars[i].x, stars[i].y, 7);

        //remove star if out of bounds
        if(stars[i].isOutOfBounds()) {
            stars.splice(i, 1);
        }
    }
}