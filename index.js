"use strict";

// globals
const GLOBAL_CANVAS_WIDTH = document.body.clientWidth;
const GLOBAL_CANVAS_HEIGHT = document.body.clientHeight;

let global_circles = [];
let global_color_min = [];
let global_color_max = [];


// circle class - we're going to draw a bunch of circles (technically arcs)
class Circle {
    constructor(radius=100, color=[200,0,0], speed=1, lineWidth=5, degrees=0, 
        x=document.body.clientWidth/2, y=document.body.clientHeight/2, 
        colorMultipliers=[1,1,1], anticlockwise=false) 
    {
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.lineWidth = lineWidth;
        this.degrees = degrees;
        this.x = x;
        this.y = y;
        this.colorMultipliers = colorMultipliers;
        this.anticlockwise = anticlockwise;
    }

    // shift the start location by adding speed to degrees
    addSpeedToDegrees() {
        this.degrees += this.speed;

        // reset degrees if > 360 to avoid infinity
        // code will work without this
        if (this.degrees > 360) {
            this.degrees = this.degrees % 360;
        }
    }

    // convert degrees to get the start in radians
    getStartRadians() {
        return this.degrees * Math.PI/180;
    }

    // convert degrees to get the end in radians
    getEndRadians() {
        return (this.degrees+this.speed) * Math.PI/180;
    }

    // adjust a color
    // picks a random rgb channel to adjust
    // and then adjusts it by a random value
    // reverses direction if bounds (0, 255) are exceeded
    adjustColor() {
        const colorInt = getRandomInt(0, 3);
        const colorAdj = getRandomInt(1, 5);

        // adjust color
        this.color[colorInt] += colorAdj * this.colorMultipliers[colorInt];

        // reverse direction once an end is reached by changing the dir
        if (this.color[colorInt] < global_color_min[colorInt]) {
            this.color[colorInt] = global_color_min[colorInt];
            this.colorMultipliers[colorInt] *= -1;
        }
        if (this.color[colorInt] > global_color_max[colorInt]) {
            this.color[colorInt] = global_color_max[colorInt];
            this.colorMultipliers[colorInt] *= -1;
        }

    }

    // draw circle on context
    drawCircle(context) {
        context.strokeStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
        context.lineWidth = this.lineWidth;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, this.getStartRadians(), this.getEndRadians(), this.anticlockwise);
        context.stroke();
        context.closePath();
    }
}

// gets a random Int from [min, max)
// TODO confirm bounds
function getRandomInt(min, max) {
    return min === max ? min : Math.floor(Math.random()*(max-min)) + min;
}

// gets a random Float from [min, max)
// TODO confirm bounds
function getRandomFloat(min, max) {
    return min === max ? min : Math.random()*(max-min) + min;
}

// adjust circles and then draw them
function drawCircles(circles, context){
    for (let i = 0; i < circles.length; i++) {
        circles[i].addSpeedToDegrees(); // adjust start pos
        circles[i].adjustColor(); // adjust color
        circles[i].drawCircle(context); // draw circle
    }
}

// clear the canvas / context
function clear(context) {
    context.clearRect(0, 0, GLOBAL_CANVAS_WIDTH, GLOBAL_CANVAS_WIDTH);
}

// draw on the canvas / context
function draw() {
    // get the canvas
    const canvas = document.getElementById('canvas')

    // get context, we draw on this
    var context = canvas.getContext('2d');

    // clear
    // clear(context);

    // draw circles
    drawCircles(global_circles, context);

    // request further animation
    window.requestAnimationFrame(draw);
}

// get the min and max values for our circles from user input
function getValues() {
    return {
        numCircles: parseInt(document.getElementById('numCircles').value),
        radius: {
            min: parseInt(document.getElementById('minRadius').value),
            max: parseInt(document.getElementById('maxRadius').value)
        },
        speed: {
            min: parseFloat(document.getElementById('minSpeed').value),
            max: parseFloat(document.getElementById('maxSpeed').value)
        },
        lineWidth: {
            min: parseInt(document.getElementById('minLineWidth').value),
            max: parseInt(document.getElementById('maxLineWidth').value)
        },
        degrees: {
            min: parseInt(document.getElementById('minDegrees').value),
            max: parseInt(document.getElementById('maxDegrees').value)
        },
        x: {
            min: parseInt(document.getElementById('minX').value),
            max: parseInt(document.getElementById('maxX').value)
        },
        y: {
            min: parseInt(document.getElementById('minY').value),
            max: parseInt(document.getElementById('maxY').value)
        },
        red: {
            min: parseInt(document.getElementById('minRed').value),
            max: parseInt(document.getElementById('maxRed').value)
        },
        green: {
            min: parseInt(document.getElementById('minGreen').value),
            max: parseInt(document.getElementById('maxGreen').value)
        },
        blue: {
            min: parseInt(document.getElementById('minBlue').value),
            max: parseInt(document.getElementById('maxBlue').value)
        }
    }
}

// initialize circles with random values based on user params
function initCircles() {
    // get min/max values from user
    const values = getValues();
    console.log(values);

    // reset globals
    global_circles = [];
    global_color_min = [values.red.min, values.green.min, values.blue.min];
    global_color_max = [values.red.max, values.green.max, values.blue.max];

    // create and push new circles to global array
    for (let i = 0; i < values.numCircles; i++) {
        global_circles.push(new Circle(
            /*radius*/
            getRandomInt(values.radius.min, values.radius.max),
            /*color*/
            [getRandomInt(values.red.min, values.red.max), 
                getRandomInt(values.green.min, values.green.max),
                getRandomInt(values.blue.min, values.blue.max)],
            /*speed - rounded to 2 decimals*/
            parseFloat(getRandomFloat(values.speed.min, values.speed.max).toFixed(2)), 
            /*lineWidth*/
            getRandomInt(values.lineWidth.min, values.lineWidth.max), 
            /*degrees = startLoc*/
            getRandomInt(values.degrees.min, values.degrees.max),
            /*x*/
            getRandomInt(values.x.min, values.x.max),
            /*y*/
            getRandomInt(values.y.min, values.y.max)   
        ));
    }

    console.log(global_circles);
}

// initialize everything, start drawing
function init() {
    event.preventDefault();
    console.log('init...');

    // get canvas and scale it to 100vw x 100vh
    // otherwise drawing will be distorted
    var canvas = document.getElementById('canvas');
    canvas.width = GLOBAL_CANVAS_WIDTH;
    canvas.height = GLOBAL_CANVAS_HEIGHT;

    // check that canvas is supported
    if (canvas.getContext) {
        // create circles
        initCircles();

        // setup animation
        window.requestAnimationFrame(draw);
    }
}