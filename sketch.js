// ********************************
// BACKGROUND SUBTRACTION EXAMPLE *
// ********************************
var video;
var prevImg;    // STEP 1
var diffImg;
var currImg;
var thresholdSlider;
var threshold;
var grid;       // STEP 3

function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    // Creates the slider with range and starting point
    thresholdSlider = createSlider(0, 255, 20);
    thresholdSlider.position(20, 20);

    grid = new Grid(640, 480);  // STEP 3
}

function draw() {
    background(0);
    image(video, 0, 0);

    // Creates a smaller copy of the current video frame
    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    currImg.resize(currImg.width / 4, currImg.height / 4);  // STEP 5
    currImg.filter(BLUR, 3); // STEP 4

    // Creates an image to store the difference between current and previous frames
    diffImg = createImage(video.width/4, video.height/4);   // STEP 5
    diffImg.loadPixels(); 

    // Gets the threshold value from a slider
    threshold = thresholdSlider.value();

    // Checks if the previous frame exists
    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        // Iterates over each pixel of the current frame
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                var index = (x + (y * currImg.width)) * 4;
                
                // Gets the RGB values of the current pixel
                var redSource = currImg.pixels[index + 0];
                var greenSource = currImg.pixels[index + 1];
                var blueSource = currImg.pixels[index + 2];

                // Gets the RGB values of the corresponding pixel in the previous frame
                var redBack = prevImg.pixels[index + 0];
                var greenBack = prevImg.pixels[index + 1];
                var blueBack = prevImg.pixels[index + 2];

                // Calculates the Euclidean distance between the two pixels
                var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);
                // Compares the distance with the threshold
                if (d > threshold) {
                    // If the difference is above the threshold, sets the pixel to black (no difference)
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                // If the difference is below the threshold, sets the pixel to white (difference detected)
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }

    //STEP 2
    prevImg = createImage(currImg.width, currImg.height);   // Creates an image to store the previous frame
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height); // Copy the current frame to the previous frame image
    diffImg.updatePixels();     // Updates the pixel data of the difference image
    image(diffImg, 640, 0);     // Displays the difference image on the canvas at position (640, 0)

    noFill();                   // Sets the fill color to transparent (no fill)
    stroke(255);                // Sets the stroke color to white
    text(threshold, 160, 35);   // Displays the value of the threshold variable as text at position (160, 35) on the canvas

    grid.run(diffImg); // STEP 3
}

function keyPressed() {
    // prevImg = createImage(currImg.width, currImg.height);
    // prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
    // console.log("saved new background");
}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
  var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
  return d;
}
