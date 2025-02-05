const PARTICLE_SIZE = 5;
const CANVAS_HEIGHT = 700;
const CANVAS_WIDTH = 500;
const MAX_BRUSH_SIZE = 10;

const FRAMERATE = 300;

const HUE_MIN = 1;
const HUE_MAX = 360;
const HUE_START = 150;
const HUE_STEP = 1;
const HSL_SATURATION = 80;
const HSL_LIGHTNESS = 180;

let grid;
let cols, rows;
let hueValue = HUE_START;

function withinRows(r) {
  return r >= 0 && r < rows;
}

function withinCols(c) {
  return c >= 0 && c < cols;
}

function setup() {
  createCanvas(CANVAS_HEIGHT, CANVAS_WIDTH);
  colorMode(HSB, HUE_MAX, 255, 255);
  frameRate(FRAMERATE);

  cols = width / PARTICLE_SIZE;
  rows = height / PARTICLE_SIZE;
  grid = new Array(cols).fill().map(() => new Array(rows).fill(0));
}

function mouseDragged() {
  function writePixel(x, y, hue) {
    if (withinCols(x) && withinRows(y) && grid[x][y] === 0) {
      grid[x][y] = hue;
    }
  }

  const x = floor(mouseX / PARTICLE_SIZE);
  const y = floor(mouseY / PARTICLE_SIZE);

  const brushSize = floor(random(MAX_BRUSH_SIZE) + 1);
  const negativeBrushSize = floor(brushSize / 2) * -1;
  const positiveBrushSize = floor(brushSize) / 2;

  for (let i = negativeBrushSize; i < positiveBrushSize; i++) {
    writePixel(x + i, y, hueValue);
  }

  hueValue = hueValue >= HUE_MAX ? HUE_MIN : hueValue + HUE_STEP;
}

function render() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      noStroke();

      if (grid[i][j] === 0) {
        continue;
      }

      fill(grid[i][j], HSL_SATURATION, HSL_LIGHTNESS);
      const x = i * PARTICLE_SIZE;
      const y = j * PARTICLE_SIZE;
      square(x, y, PARTICLE_SIZE);
    }
  }
}

function getNextFrame() {
  let nextFrame = new Array(cols).fill().map(() => new Array(rows).fill(0));

  function executeNextFrame(c, r) {
    const current = grid[c][r];

    if (current === 0) {
      //se ta vazio
      return;
    }

    //random direction
    const LEFT = -1;
    const RIGHT = 1;
    const rd = random(1) > 0.5 ? LEFT : RIGHT;

    if (withinRows(r + 1) && grid[c][r + 1] === 0) {
      //se ta vazio embaixo
      nextFrame[c][r + 1] = current;
    } else if (
      withinCols(c + rd) &&
      withinRows(r + 1) &&
      grid[c + rd][r + 1] === 0
    ) {
      //se ta vazio na diagonal
      nextFrame[c + rd][r + 1] = current;
    } else {
      //se nao ta vazio e tem apoio
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
