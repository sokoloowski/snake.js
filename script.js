const gameboard = document.getElementById("gameboard");
const gameboardCtx = gameboard.getContext("2d");
let direction = "right";
let lost = false
let paused = true;
let movement;
let moved = false;

color = {
    yellow: "#f0db4f",
    black: "#323330",
    red: "#f44336",
    green: "#4caf50",
};

let board = {
    width: 400,
    height: 400,
};

let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
];

let apple = {
    x: -10,
    y: -10,
};

function clearCanvas() {
    gameboardCtx.fillStyle = color.black;
    gameboardCtx.strokeStyle = color.yellow;
    gameboardCtx.fillRect(0, 0, board.width, board.height);
    gameboardCtx.strokeRect(0, 0, board.width, board.height);

    gameboardCtx.strokeStyle = color.red;
    gameboardCtx.strokeRect(apple.x, apple.y, 10, 10);
}

function drawSnake() {
    snake.forEach((snakePart) => {
        gameboardCtx.strokeStyle = color.green;
        gameboardCtx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    });
}

function moveSnake() {
    dx = direction == "right" ? 10 : direction == "left" ? -10 : 0;
    dy = direction == "down" ? 10 : direction == "up" ? -10 : 0;
    const head = {
        x: (snake[0].x + dx + board.width) % board.width,
        y: (snake[0].y + dy + board.height) % board.height,
    };
    if (inSnake(head.x, head.y)) {
        gameOver();
    }
    if (head.x == apple.x && head.y == apple.y) {
        placeApple();
        let points = document.getElementById("score").innerText;
        document.getElementById("score").innerText = ++points;
    } else {
        snake.pop();
    }
    snake.unshift(head);
    moved = true;
}

function placeApple() {
    do {
        apple.x = Math.floor(Math.random() * (board.width / 10)) * 10;
        apple.y = Math.floor(Math.random() * (board.height / 10)) * 10;
    } while (inSnake(apple.x, apple.y));
}

function inSnake(x, y) {
    res = false
    snake.forEach((snakePart) => {
        if (snakePart.x == x && snakePart.y == y) {
            res = true;
            return;
        }
    });
    return res;
}

document.addEventListener("keydown", (event) => {
    if (!paused && moved) {
        if (event.key == "ArrowRight" && direction != "left") {
            direction = "right";
        }
        if (event.key == "ArrowLeft" && direction != "right") {
            direction = "left";
        }
        if (event.key == "ArrowDown" && direction != "up") {
            direction = "down";
        }
        if (event.key == "ArrowUp" && direction != "down") {
            direction = "up";
        }
        moved = false;
    }
    if (event.key == "Escape" && !lost) {
        if (paused) {
            placeApple();
            movement = setInterval(() => {
                clearCanvas();
                moveSnake();
                drawSnake();
            }, 100);
        } else {
            clearInterval(movement);
        }

        paused = !paused;
    }
});

function gameOver() {
    clearInterval(movement);
    lost = true;
    gameboardCtx.fillStyle = color.red;
    gameboardCtx.font = "30px Arial";
    gameboardCtx.textAlign = "center";
    gameboardCtx.fillText("Game over!", board.width / 2, 50);
    gameboardCtx.font = "20px Arial";
    gameboardCtx.fillText("Reload page to try again", board.width / 2, 80);
}

clearCanvas();
gameboardCtx.fillStyle = color.yellow;
gameboardCtx.font = "30px Arial";
gameboardCtx.textAlign = "center";
gameboardCtx.fillText("Press Esc to start", board.width / 2, 50);
drawSnake();
