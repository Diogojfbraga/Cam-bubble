class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];

    /* STEP 6 - Idea 1
      NoteState array is used to drive different effects that change over time after a note has been activated. 
      The noteState array stores the state of each note in the grid, indicating whether it is active or not.
    */
    this.noteState = [];

    // Initalises grid structure and state
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img) {
    // Set smoke-like colors
    var colorRange = 100; // Range of color variation
    var baseColor = color(200); // Base color of smoke
    var colorOffset = 50; // Offset for color variation
  
    noStroke();
    for (var i = 0; i < this.notePos.length; i++) {
      for (var j = 0; j < this.notePos[i].length; j++) {
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j] > 0) {
          var alpha = this.noteState[i][j] * 200;
          
          /* STEP 6 - Idea 2
          This code is used to generate a random smoke-like color for the active notes being drawn. 
          - baseColor represents the base color of the smoke, which is initially set to a gray color (200).
          - colorRange determines the range of color variation for the smoke. It specifies how much the random 
            color components (red, green, blue) can deviate from the base color.
          - colorOffset adds an offset to the random color components, shifting the overall color of the smoke.
          - alpha is the transparency value for the smoke color, which is calculated based on the noteState of the active note.
          */

          // Randomizes the smoke color within the color range
          var smokeColor = color(
            red(baseColor) + random(-colorRange, colorRange) + colorOffset,
            green(baseColor) + random(-colorRange, colorRange) + colorOffset,
            blue(baseColor) + random(-colorRange, colorRange) + colorOffset,
            alpha
          );
  
          /* STEP 6 - Idea 2
           * this.noteSize represents the size of a single note in the grid.
           * this.noteState[i][j] retrieves the state of the current note, which indicates its activation level or intensity.
           * The mergedX and mergedY variables calculate the position of the merged note. x and y represent the coordinates 
           * of the current note in the grid. By adding the radius to both the x and y coordinates, the merged note's position 
           * is shifted by half its size (radius) so that it is centered on the original note's position.
           */
          // Merges adjacent circles
          var mergedSize = this.noteSize * this.noteState[i][j];
          var radius = mergedSize / 2;
          var mergedX = x + radius;
          var mergedY = y + radius;
  
          /* STEP 2 - Idea 2
           * This code checks and merges the current note with its right and bottom neighbors if they are active. 
           */
          // Checks and merges with right neighbor
          if (i < this.notePos.length - 1 && this.noteState[i + 1][j] > 0) {
            var rightSize = this.noteSize * this.noteState[i + 1][j];
            mergedSize += rightSize;
            radius = mergedSize / 2;
            mergedX = (x + this.notePos[i + 1][j].x + this.noteSize) / 2;
          }
  
          // Checks and merges with bottom neighbor
          if (j < this.notePos[i].length - 1 && this.noteState[i][j + 1] > 0) {
            var bottomSize = this.noteSize * this.noteState[i][j + 1];
            mergedSize += bottomSize;
            radius = mergedSize / 2;
            mergedY = (y + this.notePos[i][j + 1].y + this.noteSize) / 2;
          }
  
          /* STEP 2 - Idea 2
            The provided code segment introduces noise-based effects to the merged notes' positions and sizes.
            The noise() function generates Perlin noise based on the given parameters. In this case, it uses the 
              i and j indices of the merged note in the grid, multiplied by 0.1, and the current time in milliseconds 
              (millis()) multiplied by 0.001 to introduce time-based variation. The resulting value, noiseVal, will be 
              used to control the displacement and distortion effects.
           */
          // Apply smoke-like visual effects
          var noiseVal = noise(i * 0.1, j * 0.1, millis() * 0.001);
          var displacement = noiseVal * mergedSize * 0.5;
          mergedX += random(-displacement, displacement);
          mergedY += random(-displacement, displacement);
          var distortion = noiseVal * mergedSize * 0.2;
          var finalSize = mergedSize + random(-distortion, distortion);
  
          fill(smokeColor);
          ellipse(mergedX, mergedY, finalSize, finalSize);
  
          /* STEP 6 - Idea 1
            After a note is activated (when noteState[i][j] is greater than 0), various visual effects are applied to create a 
              smoke-like appearance. The noteState[i][j] value is used to determine the size of the note, and the note's position is 
              calculated based on the grid position and size. 
              The neighboring notes are checked to determine if they should be merged with the current note, creating larger circles.
          */
          var mergedNoteState = mergedSize / this.noteSize;
          this.noteState[i][j] = mergedNoteState;
          if (i < this.notePos.length - 1) {
            this.noteState[i + 1][j] = 0; // Set right neighbor's state to 0
          }
          
          if (j < this.notePos[i].length - 1) {
            this.noteState[i][j + 1] = 0; // Set bottom neighbor's state to 0
          }
        }
          /* STEP 6 - Idea 1
          The noteState[i][j] value is gradually decreased over time (this.noteState[i][j] -= 0.05), constraining it between 0 and 1 
          (constrain(this.noteState[i][j], 0, 1)). This gradual decrease in noteState allows the effects to fade out over time.
          */
          this.noteState[i][j] -= 0.05;
          this.noteState[i][j] = constrain(this.noteState[i][j], 0, 1);
      }
    }
  }
  
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
              this.noteState[i][j] = 1;
            }
        }
    }
  }
}
