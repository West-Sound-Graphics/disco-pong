// Disco Pong Game using Three.js

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 10);
scene.add(directionalLight);

// Game objects
const paddleGeometry = new THREE.BoxGeometry(1, 5, 1);
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);

// Player paddle (left)
const playerPaddleMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
const playerPaddle = new THREE.Mesh(paddleGeometry, playerPaddleMaterial);
playerPaddle.position.set(-15, 0, 0);
scene.add(playerPaddle);

// Computer paddle (right)
const computerPaddleMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });
const computerPaddle = new THREE.Mesh(paddleGeometry, computerPaddleMaterial);
computerPaddle.position.set(15, 0, 0);
scene.add(computerPaddle);

// Ball
const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0, 0);
scene.add(ball);

// Game variables
let ballVelocity = new THREE.Vector3(0.1, 0.05, 0);
let playerScore = 0;
let computerScore = 0;
const paddleSpeed = 0.2;
const ballSpeed = 0.15;
const maxScore = 10;

// Controls
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// AI variables
let computerTargetY = 0;

// Update score display
function updateScore() {
    document.getElementById('score').textContent = `${playerScore} : ${computerScore}`;
}

// Reset ball
function resetBall() {
    ball.position.set(0, 0, 0);
    ballVelocity.set(Math.random() > 0.5 ? ballSpeed : -ballSpeed, (Math.random() - 0.5) * 0.1, 0);
}

// Game loop
function animate() {
    requestAnimationFrame(animate);

    // Player controls
    if (keys['ArrowUp'] && playerPaddle.position.y < 8) {
        playerPaddle.position.y += paddleSpeed;
    }
    if (keys['ArrowDown'] && playerPaddle.position.y > -8) {
        playerPaddle.position.y -= paddleSpeed;
    }

    // AI for computer paddle
    computerTargetY = ball.position.y;
    const computerSpeed = 0.1;
    if (computerPaddle.position.y < computerTargetY - 0.5) {
        computerPaddle.position.y += computerSpeed;
    } else if (computerPaddle.position.y > computerTargetY + 0.5) {
        computerPaddle.position.y -= computerSpeed;
    }
    // Keep computer paddle within bounds
    computerPaddle.position.y = Math.max(-8, Math.min(8, computerPaddle.position.y));

    // Ball movement
    ball.position.add(ballVelocity);

    // Ball collision with top and bottom walls
    if (ball.position.y > 9.5 || ball.position.y < -9.5) {
        ballVelocity.y = -ballVelocity.y;
    }

    // Ball collision with paddles
    if (ball.position.x < -14 && ball.position.x > -16 && ball.position.y > playerPaddle.position.y - 2.5 && ball.position.y < playerPaddle.position.y + 2.5) {
        ballVelocity.x = -ballVelocity.x;
        ballVelocity.y += (ball.position.y - playerPaddle.position.y) * 0.1; // Add spin
    }
    if (ball.position.x > 14 && ball.position.x < 16 && ball.position.y > computerPaddle.position.y - 2.5 && ball.position.y < computerPaddle.position.y + 2.5) {
        ballVelocity.x = -ballVelocity.x;
        ballVelocity.y += (ball.position.y - computerPaddle.position.y) * 0.1; // Add spin
    }

    // Scoring
    if (ball.position.x > 20) {
        playerScore++;
        updateScore();
        resetBall();
    }
    if (ball.position.x < -20) {
        computerScore++;
        updateScore();
        resetBall();
    }

    // Check for game over
    if (playerScore >= maxScore || computerScore >= maxScore) {
        alert(playerScore >= maxScore ? 'You win!' : 'Computer wins!');
        playerScore = 0;
        computerScore = 0;
        updateScore();
        resetBall();
    }

    // Camera position
    camera.position.z = 20;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the game
animate();