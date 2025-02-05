const SIZE = 5
const HEIGHT = 700
const WIDTH = 500
const MAX_BRUSH_SIZE = 5;

let grid;
let cols, rows;
let hueValue = 150;

function withinRows(r) {
  return r >= 0 && r < rows;
}

function withinCols(c) {
  return c >= 0 && c < cols;
}

function setup() {
  createCanvas(HEIGHT, WIDTH);
  colorMode(HSB, 360, 255, 255);
  frameRate(120);

  cols = width / SIZE;
  rows = height / SIZE;
  grid = new Array(cols).fill().map(() => new Array(rows).fill(0));
}

function mouseDragged() {
  function writePixel(x, y, hue) {
    if (withinCols(x) && withinRows(y) && grid[x][y] === 0) {
      grid[x][y] = hue;
    }
  }

  const x = floor(mouseX / SIZE);
  const y = floor(mouseY / SIZE);

  const brushSize = floor(random(MAX_BRUSH_SIZE) + 1);
  const negativeBrushSize = floor(brushSize / 2) * -1;
  const positiveBrushSize = floor(brushSize) / 2;

  for (let i = negativeBrushSize; i < positiveBrushSize; i++) {
    writePixel(x + i, y, hueValue);
  }

  hueValue = hueValue >= 360 ? 1 : hueValue + 1;
}

function render() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      noStroke();

      if (grid[i][j] === 0) {
        continue;
      }

      fill(grid[i][j], 80, 180);
      const x = i * SIZE;
      const y = j * SIZE;
      square(x, y, SIZE);
    }
  }
}

function getNextFrame() {
  let nextFrame = new Array(cols).fill().map(() => new Array(rows).fill(0));

  function executeNextFrame(c, r) {
    const current = grid[c][r];

    if (current === 0) { //se ta vazio
      return;
    }

    //random direction
    const rd = random(1) > 0.5 ? -1 : 1;

    if (withinRows(r + 1) && grid[c][r + 1] === 0) { //se ta vazio embaixo
      nextFrame[c][r + 1] = current;
    } else if (withinCols(c + rd) && withinRows(r + 1) && grid[c + rd][r + 1] === 0) { //se ta vazio na diagonal
      nextFrame[c + rd][r + 1] = current;
    } else { //se nao ta vazio e tem apoio
      nextFrame[c][r] = current;
    }
  }

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      executeNextFrame(c, r);
    }
  }

  return nextFrame;
}



function draw() {
  background(0);
  render();
  grid = getNextFrame();
}
