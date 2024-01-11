# Background Subtraction Example with p5.js

This p5.js sketch demonstrates background subtraction using a live video feed.

## Setup

1. **Canvas:** Creates a canvas twice the width of a standard video frame.
2. **Video Capture:** Captures video from the user's webcam.
3. **Threshold Slider:** Creates a slider for adjusting the threshold value.

## Components

### Grid Class (`Grid`)

- Initializes a grid with specified dimensions.

### Functions

#### `setup()`

- Initializes the canvas, video capture, and threshold slider.
- Creates an instance of the `Grid` class.

#### `draw()`

- Displays the live video feed.
- Processes the video frames to detect changes and display a difference image.
- Displays the threshold value.
- Utilizes the `Grid` class to overlay a grid on the difference image.

#### `keyPressed()`

- Uncomment the commented code to save the current frame as the background.

#### `distSquared(x1, y1, z1, x2, y2, z2)`

- A faster method for calculating color similarity without computing the square root.

## Background Subtraction Process

1. **Capture Current Frame:**
   - Captures the current frame from the live video feed.

2. **Create Smaller Copy:**
   - Creates a smaller copy of the current video frame, resizes it, and applies a blur filter.

3. **Difference Image:**
   - Creates an image to store the difference between the current and previous frames.
   - Checks if a previous frame exists.

4. **Blur Filter:**
   - Applies a blur filter to the smaller copy of the current frame.

5. **Thresholding:**
   - Compares the color difference between the current and previous frames.
   - If the difference is above the threshold, sets the pixel to black.
   - If the difference is below the threshold, sets the pixel to white.

6. **Update Previous Frame:**
   - Updates the pixel data of the difference image.
   - Displays the difference image on the canvas.

7. **Overlay Grid:**
   - Utilizes the `Grid` class to overlay a grid on the difference image.

8. **Display Threshold Value:**
   - Displays the value of the threshold variable on the canvas.

## Interaction

- **Mouse Click:** Clicking the mouse triggers a redraw, allowing for interactive updates.

Feel free to explore and modify this example to suit your needs!
