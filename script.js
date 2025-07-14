const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startMessage = document.getElementById('startMessage');

let score = 0;
let gameSpeed = 5;
let gameOver = false;
let gameStarted = false;

// Dinosaur properties
const dinosaur = {
    x: 50,
    y: canvas.height - 50, // Adjusted for new height
    width: 40, // Adjusted for new width
    height: 50, // Adjusted for new height
    velocityY: 0,
    isJumping: false,
    draw() {
        ctx.fillStyle = '#555'; // Dinosaur color

        // Body
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.6);
        ctx.lineTo(this.x + this.width * 0.9, this.y + this.height * 0.2);
        ctx.lineTo(this.x + this.width * 0.6, this.y);
        ctx.lineTo(this.x + this.width * 0.2, this.y + this.height * 0.1);
        ctx.closePath();
        ctx.fill();

        // Legs (simple rectangles for now)
        ctx.fillRect(this.x + this.width * 0.1, this.y + this.height * 0.8, this.width * 0.2, this.height * 0.2);
        ctx.fillRect(this.x + this.width * 0.5, this.y + this.height * 0.8, this.width * 0.2, this.height * 0.2);
    },
    jump() {
        if (!this.isJumping) {
            this.velocityY = -10;
            this.isJumping = true;
        }
    },
    update() {
        this.y += this.velocityY;
        this.velocityY += 0.5; // Gravity

        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height - 5; // Adjusted to be slightly above the ground
            this.isJumping = false;
            this.velocityY = 0;
        }
    }
};

// Obstacle properties
class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = '#333'; // Obstacle color

        // Main body of cactus
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Arms of cactus
        ctx.fillRect(this.x - this.width * 0.3, this.y + this.height * 0.4, this.width * 0.4, this.height * 0.2);
        ctx.fillRect(this.x + this.width * 0.9, this.y + this.height * 0.2, this.width * 0.2, this.height * 0.3);
    }

    update() {
        this.x -= gameSpeed;
    }
}

let obstacles = [];

function generateObstacle() {
    const obstacleWidth = 20 + Math.random() * 10; // Adjusted width
    const obstacleHeight = 30 + Math.random() * 20; // Adjusted height
    const obstacleX = canvas.width;
    const obstacleY = canvas.height - obstacleHeight;
    obstacles.push(new Obstacle(obstacleX, obstacleY, obstacleWidth, obstacleHeight));
}

let obstacleTimer = 0;
const obstacleInterval = 100; // How often to generate obstacles

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#777';
    ctx.fillRect(0, canvas.height - 5, canvas.width, 5);

    dinosaur.update();
    dinosaur.draw();

    // Update and draw obstacles
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.update();
        obstacle.draw();

        // Collision detection
        if (
            dinosaur.x < obstacle.x + obstacle.width &&
            dinosaur.x + dinosaur.width > obstacle.x &&
            dinosaur.y < obstacle.y + obstacle.height &&
            dinosaur.y + dinosaur.height > obstacle.y
        ) {
            gameOver = true;
            alert('Game Over! Score: ' + score);
            startMessage.style.display = 'block';
        }

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            i--;
            score++;
            scoreDisplay.textContent = score;
            if (score % 100 === 0) {
                gameSpeed += 0.5; // Increase speed every 100 points
            }
        }
    }

    // Generate new obstacles
    obstacleTimer++;
    if (obstacleTimer > obstacleInterval) {
        generateObstacle();
        obstacleTimer = 0;
    }

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    score = 0;
    gameSpeed = 5;
    gameOver = false;
    obstacles = [];
    dinosaur.y = canvas.height - dinosaur.height;
    dinosaur.velocityY = 0;
    dinosaur.isJumping = false;
    scoreDisplay.textContent = score;
    startMessage.style.display = 'block';
    gameStarted = false;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            gameOver = false;
            startMessage.style.display = 'none';
            gameLoop();
        } else if (!gameOver) {
            dinosaur.jump();
        } else {
            resetGame();
        }
    }
});

// Initial draw to show the dinosaur before game starts
dinosaur.draw();
