// Disco Pong Game using Three.js

// Audio setup for disco background music
let audioContext;
let discoMusic;
let isMusicPlaying = false;

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a simple disco beat using Web Audio API
    function createDiscoBeat() {
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        // Bass drum sound
        oscillator1.frequency.setValueAtTime(60, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        // Hi-hat sound
        oscillator2.frequency.setValueAtTime(8000, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(audioContext.currentTime + 0.2);
        oscillator2.stop(audioContext.currentTime + 0.2);
    }
    
    // Create disco melody
    function createDiscoMelody() {
        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major scale
        const melody = [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0]; // Disco pattern
        
        melody.forEach((noteIndex, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.frequency.setValueAtTime(notes[noteIndex % notes.length], audioContext.currentTime);
                oscillator.type = 'sawtooth';
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            }, index * 200);
        });
    }
    
    // Main disco loop
    function playDiscoLoop() {
        if (!isMusicPlaying) return;
        
        createDiscoBeat();
        createDiscoMelody();
        
        // Repeat every 4 seconds
        setTimeout(playDiscoLoop, 4000);
    }
    
    discoMusic = {
        play: function() {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            isMusicPlaying = true;
            playDiscoLoop();
        },
        pause: function() {
            isMusicPlaying = false;
        }
    };
}

// Sound effects functions
function playWallHitSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playPaddleHitSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.2);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

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

// Player paddle (left) - Disco glowing material
const playerPaddleMaterial = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff00ff,
    emissiveIntensity: 0.3,
    metalness: 0.1,
    roughness: 0.4
});
const playerPaddle = new THREE.Mesh(paddleGeometry, playerPaddleMaterial);
playerPaddle.position.set(-15, 0, 0);
scene.add(playerPaddle);

// Computer paddle (right) - Disco glowing material
const computerPaddleMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 0.3,
    metalness: 0.1,
    roughness: 0.4
});
const computerPaddle = new THREE.Mesh(paddleGeometry, computerPaddleMaterial);
computerPaddle.position.set(15, 0, 0);
scene.add(computerPaddle);

// Ball - Disco glowing material
const ballMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.5,
    metalness: 0.0,
    roughness: 0.2
});
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
let time = 0; // For disco color animation

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
        playWallHitSound();
    }

    // Ball collision with paddles
    if (ball.position.x < -14 && ball.position.x > -16 && ball.position.y > playerPaddle.position.y - 2.5 && ball.position.y < playerPaddle.position.y + 2.5) {
        ballVelocity.x = -ballVelocity.x;
        ballVelocity.y += (ball.position.y - playerPaddle.position.y) * 0.1; // Add spin
        playPaddleHitSound();
    }
    if (ball.position.x > 14 && ball.position.x < 16 && ball.position.y > computerPaddle.position.y - 2.5 && ball.position.y < computerPaddle.position.y + 2.5) {
        ballVelocity.x = -ballVelocity.x;
        ballVelocity.y += (ball.position.y - computerPaddle.position.y) * 0.1; // Add spin
        playPaddleHitSound();
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

    // Disco color animation
    time += 0.05;
    const hue1 = (time * 0.1) % 1;
    const hue2 = (time * 0.15 + 0.33) % 1;
    const hue3 = (time * 0.2 + 0.66) % 1;

    playerPaddleMaterial.emissive.setHSL(hue1, 1, 0.5);
    playerPaddleMaterial.color.setHSL(hue1, 1, 0.7);

    computerPaddleMaterial.emissive.setHSL(hue2, 1, 0.5);
    computerPaddleMaterial.color.setHSL(hue2, 1, 0.7);

    ballMaterial.emissive.setHSL(hue3, 1, 0.5);
    ballMaterial.color.setHSL(hue3, 1, 0.7);

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
initAudio();
animate();

// Music toggle functionality
const musicToggle = document.getElementById('music-toggle');
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        discoMusic.pause();
        musicToggle.textContent = '🎵 Play Disco Music';
        musicToggle.classList.remove('playing');
    } else {
        discoMusic.play();
        musicToggle.textContent = '🎵 Pause Disco Music';
        musicToggle.classList.add('playing');
    }
});