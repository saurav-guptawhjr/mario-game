var mario, mario_running, mario_collided;
var ground, groundImg;
var brick, brickImg, brickGroup;
var obstacle, obstacleAnimation, obstacleGroup;

var score = 0;

var gamestate = "play";

var gameoverImg, restartImg;
var jumpSound, checkpointSound, dieSound;

var bg;


function preload() {

  mario_running = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  mario_collided = loadImage("collided.png");

  groundImg = loadImage("ground2.png");

  brickImg = loadImage("brick.png");

  obstacleAnimation = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");

  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  bg = loadImage("bg.png");

  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");

}



function setup() {
  createCanvas(600, 400);

  //Creating Mario
  mario = createSprite(50, 300, 20, 50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 1.7;

  //Creating Ground
  ground = createSprite(200, 360, 600, 10);
  ground.addImage("ground", groundImg);
  ground.x = ground.width / 2;
  ground.velocityX = -7;

  //Creating Group
  brickGroup = createGroup();
  obstacleGroup = createGroup();

  //Game Over & Restart Display
  gameover = createSprite(300, 190);
  gameover.addImage(gameoverImg);
  restart = createSprite(300, 230);
  restart.addImage(restartImg);
  gameover.scale = 0.7;
  restart.scale = 0.5;

  //Set collider
  //mario.debug = true;
  mario.setCollider("circle", 0, 0, 20);

  obstacleGroup = new Group();
  brickGroup = new Group();
}


function draw() {
  background(bg);

  if (gamestate === "play") {

    //Gameover Visibility Disable
    gameover.visible = false;
    restart.visible = false;

    //Adaptibility
    ground.velocityX = -(4 + 3 * score / 100);

    //Score Display
    for (i = 0; i < brickGroup.length; i++) {
      if (mario.isTouching(brickGroup.get(i))) {
        score = score + 10;
        brickGroup.get(i).destroy();
      }
    }
    textSize(14);
    fill("black");
    text("Score : " + score, 500, 60);

    //Score Sound
    if (score > 0 && score % 100 === 0) {
      checkpointSound.play();
    }

    //Moving Ground
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //Mario Jumping
    if (keyDown("space") && mario.y >= 150) {
      mario.velocityY = -9;
      jumpSound.play();
    }
    //Gravity For Mario
    mario.velocityY = mario.velocityY + 0.8;
    mario.collide(ground);

    //Spawning Bricks   
    spawnBricks();

    //Spawning Obstacles
    spawnObstacles();

    //Changing Gamestste to End, Touching Obstacles
    if (obstacleGroup.isTouching(mario)) {
      gamestate = "end";
      dieSound.play();
    }

  } else if (gamestate === "end") {

    //Display Gameover & Restart
    gameover.visible = true;
    restart.visible = true;

    //Stopping all movements
    ground.velocityX = 0;
    brickGroup.setVelocityEach(0);
    obstacleGroup.setVelocityEach(0);

    //Change Mario animation
    mario.changeAnimation("collided", mario_collided);

    //Never destroying obstacles
    obstacleGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);

    //Restart Functionality
    if (mousePressedOver(restart)) {
      reset();
    }
  }

  mario.collide(ground);

  drawSprites();
}

function reset() {
  gamestate = "play";
  gameover.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  brickGroup.destroyEach();
  score = 0;

  mario.changeAnimation("running", mario_running);
}


function spawnObstacles() {

  if (frameCount % 50 === 0) {
    obstacle = createSprite(500, 300, 10, 30);
    obstacle.addAnimation("obstacles", obstacleAnimation);
    obstacle.velocityX = -6;
    obstacle.scale = 0.7;

    //Adding Obstacles to group
    obstacleGroup.add(obstacle);
  }
}



function spawnBricks() {

  if (frameCount % 60 === 0) {
    brick = createSprite(550, 230, 40, 5);
    brick.y = Math.round(random(170, 260));
    brick.velocityX = -3;
    brick.addImage(brickImg);

    //Adding Bricks to group
    brickGroup.add(brick);

    //Adjusting Mario forward
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;

  }

}