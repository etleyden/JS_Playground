function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    noLoop();
    gui = new dat.GUI(); //set up the controller
    var numController = gui.add(Settings, "NumberOfPoints", 0, 80_000, 100);
    gui.width = 400;
    numController.onFinishChange(generateTriangle);
}
let gui;
let triangle = {
    p1: {
        x: 0,
        y: 0
    },
    p2: {
        x: 0,
        y: 0
    },
    p3: {
        x: 0,
        y: 0
    },
    height: 0,
    base: 0,
    padding: 10
}
let Settings = {
    NumberOfPoints: 5_000
};
function draw() {
    //create an equilateral triangle in the center of the screen
    triangle.height = height - (2 * triangle.padding);
    triangle.base = height / Math.cos(45/2); //trig!
    triangle.p1.x = Math.floor(width / 2); //top point
    triangle.p1.y = triangle.padding; 
    triangle.p2.x = triangle.p1.x - triangle.base / 2; //bottom left
    triangle.p2.y = height - triangle.padding;
    triangle.p3.x = triangle.p1.x + triangle.base / 2; //bottom right
    triangle.p3.y = height - triangle.padding;

    stroke("white"); //we'll remove the borders when we are done
    line(triangle.p1.x, triangle.p1.y, triangle.p2.x, triangle.p2.y);
    line(triangle.p1.x, triangle.p1.y, triangle.p3.x, triangle.p3.y);
    line(triangle.p2.x, triangle.p2.y, triangle.p3.x, triangle.p3.y);
    
    generateTriangle();
}
function generateTriangle() {
    if(Settings.NumberOfPoints > 80_000) return;
    background(0);
    let dots = Settings.NumberOfPoints;
    console.log("generating triangle...");
    let current_point = { //random point 
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    }
    fill("white")
    for(let i = 0; i < dots; i++) { 
        point(current_point.x, current_point.y); //draw our current point
        let next_point = Math.ceil(Math.random() * 3); //pick a random vertex on the triangle

        //set the next iteration of current_point to the mid_point
        current_point.x = (current_point.x + triangle["p" + next_point].x) / 2;
        current_point.y = (current_point.y + triangle["p" + next_point].y) / 2;
    }
}