// game.js

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;

// Spelobjecten
let player = {
    x: 50,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    color: "green",
    speed: 5,
    velocityY: 0,
    jumpPower: -15,
    isJumping: false,
    canJump: true
};

const gravity = 0.5;
let platforms = [
    { x: 100, y: canvas.height - 50, width: 300, height: 20 },
    { x: 450, y: canvas.height - 150, width: 300, height: 20 },
    { x: 800, y: canvas.height - 250, width: 300, height: 20 },
    { x: 1150, y: canvas.height - 350, width: 300, height: 20 },
];

let enemies = [
    { x: 400, y: canvas.height - 200, width: 40, height: 40, speed: 2 },
    { x: 900, y: canvas.height - 300, width: 40, height: 40, speed: 2 }
];

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = "blue";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

// Collision detection voor speler en platform
function checkPlatformCollision() {
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            player.canJump = true;
        }
    });
}

// Collision detection voor vijanden
function checkEnemyCollision() {
    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            resetGame();
        }
    });
}

function resetGame() {
    score = 0;
    player.x = 50;
    player.y = canvas.height - 80;
    player.velocityY = 0;
    player.isJumping = false;
}

function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speed;
        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            enemy.speed *= -1;
        }
    });
}

function updatePlayer() {
    player.velocityY += gravity;
    player.y += player.velocityY;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.isJumping = false;
        player.canJump = true;
    }

    checkPlatformCollision();
    checkEnemyCollision();
}

function handleInput(event) {
    if (event.key === "ArrowRight") player.x += player.speed;
    if (event.key === "ArrowLeft") player.x -= player.speed;
    if (event.key === " " && !player.isJumping && player.canJump) {
        player.velocityY = player.jumpPower;
        player.isJumping = true;
        player.canJump = false;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawPlatforms();
    drawEnemies();

    updatePlayer();
    moveEnemies();

    score++;
    updateScore();

    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", handleInput);
gameLoop();
