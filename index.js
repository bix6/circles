"use strict";

//bix6

// globals
let global_canvas_width = document.body.clientWidth;
let global_canvas_height = document.body.clientHeight;

let global_circles = []; // holds all the Circle's we create
let global_color_min = []; // min values for each RGB channel
let global_color_max = []; // max values for each RGB channel
let global_color_step = {}; // min and max values for color step


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
        // get channel to adjust followed by adjustment amount
        const colorInt = getRandomInt(0, 3);
        const colorAdj = getRandomFloat(global_color_step.min, global_color_step.max);

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
function getRandomInt(min, max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

// gets a random Float from [min, max)
function getRandomFloat(min, max) {
    return Math.random()*(max-min) + min;
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
// clearRect sets pixels to transparent black so I'm using a fillRect with black instead
function clear(context) {
    context.fillStyle = '#000';
    context.fillRect(0, 0, global_canvas_width, global_canvas_width);
}

// draw on the canvas / context
function draw() {
    // get the canvas
    const canvas = document.getElementById('canvas')

    // get context, we draw on this
    var context = canvas.getContext('2d', { alpha: false });

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
        },
        colorStep: {
            min: parseFloat(document.getElementById('minColorStep').value),
            max: parseFloat(document.getElementById('maxColorStep').value)
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
    global_color_step.min = values.colorStep.min;
    global_color_step.max = values.colorStep.max;

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

    // hide controls
    document.getElementById("controls").classList.add("hidden");
}

function showControls() {
    document.getElementById("controls").classList.remove("hidden");
}

// adjust default radius, x and y based on browser dimensions
// called when the body loads
function adjustDefaults() {
    const halfX = Math.floor(global_canvas_width / 2);
    const halfY = Math.floor(global_canvas_height / 2);

    // set maxRadius to larger of height or width and then divide by 2
    document.getElementById("maxRadius").value = global_canvas_height > global_canvas_width 
        ? halfY : halfX;

    // center x
    document.getElementById('minX').value = halfX;
    document.getElementById('maxX').value = halfX;

    // center y
    document.getElementById('minY').value = halfY;
    document.getElementById('maxY').value = halfY;
}

// initialize everything, start drawing
function init() {
    event.preventDefault();
    console.log('init...');

    // get canvas and scale it to updated 100vw x 100vh
    // otherwise drawing will be distorted
    global_canvas_width = document.body.clientWidth;
    global_canvas_height = document.body.clientHeight;
    var canvas = document.getElementById('canvas');
    canvas.width = global_canvas_width;
    canvas.height = global_canvas_height;

    // check that canvas is supported
    if (canvas.getContext) {
        // create circles
        initCircles();

        // clear the canvas
        clear(canvas.getContext('2d', { alpha: false }));

        // setup animation
        window.requestAnimationFrame(draw);
    }
}