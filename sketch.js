const GRID_WIDTH = 40
const GRID_HEIGHT = 20
const cell_size = 25


const Direction = {
  Up: [0, -1],
  Down: [0, 1],
  Left: [-1, 0],
  Right: [1, 0]
};

function gridToScreen(x, y){
  return [(x - GRID_WIDTH/2)*cell_size + windowWidth/2, (y - GRID_HEIGHT/2)*cell_size + windowHeight/2]
}

const HEAD = 0;
const X = 0;
const Y = 1;

class Snake {
  constructor(x, y) {
    this.segments = [[x, y],]
    this.direction = Direction.Right;
    this.new_direction = Direction.Right;
    
  }

  // returns if collision occurs
  move(){
    this.direction = this.new_direction;

    for (let i = this.segments.length - 1; i > 0; i--){
      this.segments[i] = [].concat(this.segments[i-1]);
    }

    let snake_string = JSON.stringify(this.segments);
    let new_head = [0,0]

    // Move and loop around the grid
    new_head[X] = (this.segments[HEAD][X] + this.direction[X]) % GRID_WIDTH;
    new_head[Y] = (this.segments[HEAD][Y] + this.direction[Y]) % GRID_HEIGHT;
    if (new_head[X] < 0){
      new_head[X] = GRID_WIDTH - 1;
    }
    if (new_head[Y] < 0){
      new_head[Y] = GRID_HEIGHT - 1;
    }

    if (snake_string.indexOf(JSON.stringify(new_head)) != -1){
      return true;
    }else{
      this.segments[HEAD] = new_head;
    }

      return false; 
  }

  draw(){
    push();
    fill(0, 255, 20);
    noStroke();
    for (let i = 0; i < this.segments.length; i++){
      let point = gridToScreen(this.segments[i][X], this.segments[i][Y]);
      square(point[X], point[Y], cell_size);
    }
    pop();
  }

  grow(){
    this.segments.push([].concat(this.segments[this.segments.length-1]));
  }
}

let snake = new Snake(4,4);
let apple = [0, 0];

function setup() {
  randomSeed();
  createCanvas(windowWidth*0.99, windowHeight*0.99);
  frameRate(10);

  newApple();
}

function drawSquare(grid_x, grid_y) {
  push();
  fill(0);
  strokeWeight(0.3);
  stroke(100);
  let point = gridToScreen(grid_x, grid_y)
  square(point[X], point[Y], cell_size);
  pop();
}

function drawSquares(){
  for(var j = 0; j < GRID_HEIGHT; j++){
    for (var i = 0; i < GRID_WIDTH; i++){
      drawSquare(i,j);
    }
  }
}

function drawApple(){
  push();
  noStroke();
  fill(255,15,0);
  let point = gridToScreen(apple[X], apple[Y]);
  square(point[X], point[Y], cell_size);
  pop();
}

function newApple(){
  let snake_string = JSON.stringify(snake.segments);
  let apple_string = "";
  do{
    apple[X] = Math.round(random(0, GRID_WIDTH-1));
    apple[Y] = Math.round(random(0, GRID_HEIGHT-1));
    apple_string = JSON.stringify(apple);
  } while (snake_string.indexOf(apple_string) != -1);
}

function draw() {
  background(10);
  drawSquares();
  
  // if snake is on apple
  if (JSON.stringify(snake.segments[HEAD]) == JSON.stringify(apple)){
    snake.grow();
    newApple();
  }

  let end = snake.move();
  
  drawApple();
  snake.draw();

  if (end){
    endGame();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    if (snake.direction != Direction.Right){
      snake.new_direction = Direction.Left;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (snake.direction != Direction.Left){
      snake.new_direction = Direction.Right;
    }
  } else if (keyCode === UP_ARROW) {
    if (snake.direction != Direction.Down){
      snake.new_direction = Direction.Up;
    }
  } else if (keyCode === DOWN_ARROW) {
    if (snake.direction != Direction.Up){
      snake.new_direction = Direction.Down;
    }
  }
}

function endGame(){
  fill(250,250,255);
  textStyle(BOLD);
  textSize(windowWidth/20);
  textAlign(CENTER);
  text("GAME OVER | YOUR SCORE: " + snake.segments.length, windowWidth/2, windowHeight/2);
  frameRate(0);
}