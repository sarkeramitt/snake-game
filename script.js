// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;

// Snake initial state
let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

// Initial velocity
let velocityX = 1;
let velocityY = 0;

// Food position
let foodX = Math.floor(Math.random() * tileCount);
let foodY = Math.floor(Math.random() * tileCount);

// Game state
let gameInterval;
let gameSpeed = 100; // milliseconds
let gameOver = false;

// Start game
startGame();

function startGame() {
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function gameLoop() {
    if (gameOver) {
        clearInterval(gameInterval);
        drawGameOver();
        return;
    }
    
    updateSnake();
    checkCollision();
    drawGame();
}

function updateSnake() {
    // Create new head based on current direction
    const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
    
    // Add new head to beginning of snake array
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === foodX && head.y === foodY) {
        // Increase score
        score++;
        scoreElement.textContent = score.toString();
        
        // Generate new food
        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
        
        // Speed up the game slightly
        if (gameSpeed > 50) {
            clearInterval(gameInterval);
            gameSpeed -= 2;
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        // Remove tail if snake didn't eat food
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        return;
    }
    
    // Check self collision (start from 1 to skip the head)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);
    
    // Draw snake
    snake.forEach((segment, index) => {
        // Head is darker green
        ctx.fillStyle = index === 0 ? '#006400' : '#00a000';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        
        // Draw border around segment
        ctx.strokeStyle = '#003300';
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
    
    // Draw grid (optional)
    ctx.strokeStyle = '#e0e0e0';
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function drawGameOver() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Game over text
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 15);
    
    // Score text
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
    
    // Restart instructions
    ctx.font = '16px Arial';
    ctx.fillText('Refresh the page to play again', canvas.width / 2, canvas.height / 2 + 45);
}

// Keyboard controls
function handleKeyDown(e) {
    // Get the key code
    const key = e.keyCode;
    
    // Prevent arrow keys from scrolling the page
    if ([100, 104, 102, 98].includes(key)) {
        e.preventDefault();
    }
    
    // Prevent reversing direction (can't go opposite direction immediately)
    switch (key) {
        // Numpad 8 (Up)
        case 104:
            if (velocityY !== 1) { // Not going down
                velocityX = 0;
                velocityY = -1;
            }
            break;
        // Numpad 2 (Down)
        case 98:
            if (velocityY !== -1) { // Not going up
                velocityX = 0;
                velocityY = 1;
            }
            break;
        // Numpad 4 (Left)
        case 100:
            if (velocityX !== 1) { // Not going right
                velocityX = -1;
                velocityY = 0;
            }
            break;
        // Numpad 6 (Right)
        case 102:
            if (velocityX !== -1) { // Not going left
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
}

// Add event listener for keyboard
window.addEventListener('keydown', handleKeyDown);