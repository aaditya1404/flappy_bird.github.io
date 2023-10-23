let board;
let boardwidth = 360;
let boardheight = 640;
let context;


let birdwidth = 34;
let birdheight = 24;
let birdY = boardheight / 2;
let birdX = boardwidth / 8;
let birdimg;

let bird = {
    x: birdX,
    y: birdY,
    height: birdheight,
    width: birdwidth
};

let pipeArray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let toppipeimg;
let bottompipeimg;

let velocityX = -2; // pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameover = false;
let score = 0;

let audio = new Audio("./audio/click.mpeg");
let overaudio = new Audio("./audio/gameover.mpeg");

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d"); // This includes all the 2d elements in our board

    // bird drawing
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdimg = new Image();
    birdimg.src = "./image/flappybird.png";
    birdimg.onload = function () {

        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    }

    toppipeimg = new Image();
    toppipeimg.src = './image/toppipe.png';

    bottompipeimg = new Image();
    bottompipeimg.src = './image/bottompipe.png';

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    // document.addEventListener("click", moveBird);
}

window.onclick = function () {
    audio.play();
}
window.onkeydown = function () {
    audio.play();
}


function update() {
    if (gameover) {
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (bird.y > board.height) {
            gameover = true;
        }

        if (collision(bird, pipe)) {
            gameover = true;
        }
    }

    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -2 * pipewidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameover) {
        overaudio.play();
        context.fillText("GAME OVER", 5, 90);
        // context.fillText("RESTART", 5, 135).addEventListener("click", function () {
        //     bird.y = birdY;
        //     pipeArray = [];
        //     score = 0;
        //     gameover = false;
        // });
    }
}

function placePipes() {
    if (gameover) {
        return;
    }
    let randompipeY = pipeY - pipeheight / 4 - Math.random() * (pipeheight / 2);
    let openingSpace = board.height / 4;

    let top = {
        img: toppipeimg,
        x: pipeX,
        y: randompipeY,
        width: pipewidth,
        height: pipeheight,
        passed: false
    };

    pipeArray.push(top);

    let bottom = {
        img: bottompipeimg,
        x: pipeX,
        y: randompipeY + pipeheight + openingSpace,
        width: pipewidth,
        height: pipeheight,
        passed: false
    };

    pipeArray.push(bottom);
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW" || e.code === "onclick") {
        velocityY = -6;

        if (gameover) {

            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameover = false;
        }
    }
}

function collision(a, b) {
    return a.x < b.x + b.width
        && a.x + a.width > b.x
        && a.y < b.y + b.height
        && a.y + a.height > b.y;
}