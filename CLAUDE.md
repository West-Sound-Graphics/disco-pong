# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

Open `index.html` directly in a web browser. No build process or server required.

## Project Structure

- `index.html` - Main HTML file with embedded CSS animations and UI elements
- `game.js` - All game logic, Three.js rendering, and Web Audio API sound synthesis

## Architecture

The game is built entirely in vanilla JavaScript with two external dependencies loaded from CDN:

1. **Three.js (r128)** - 3D rendering for the game scene
2. **Web Audio API** - Browser-native audio synthesis (no external audio files)

### Key Systems

**Rendering Loop** (`animate()` function): Runs via `requestAnimationFrame`, handles:
- Player paddle movement (Arrow Up/Down keys)
- Computer AI paddle tracking
- Ball physics and collision detection
- Disco color cycling on all game objects using HSL color space

**Audio System** (`initAudio()`): Uses Web Audio API oscillators and gain nodes for:
- Disco background music (4-second loop with beat and melody)
- Sound effects (wall hits, paddle hits)
- All audio is procedurally generated—no audio files

**Game State**: Controlled by `gameStarted` flag. Title screen allows configuration of:
- Ball speed (Slow: 0.08, Mid: 0.15, Fast: 0.24)
- AI skill level (Easy: 0.06, Normal: 0.1, Hard: 0.15)

### Game Physics

- Paddle boundaries: y = -8 to +8
- Wall boundaries: y = -9.5 to +9.5
- Paddle collision zones: x = -16 to -14 (player), x = 14 to 16 (computer)
- Paddle height: 5 units (collision uses ±2.5 offset)
- Ball spin: `ballVelocity.y` adjusted on paddle hit based on relative position
- Scoring: Ball passes x = 20 (player scores) or x = -20 (computer scores)
- Win condition: First to 10 points

### Color Animation

Disco effect achieved by cycling HSL hue values at different rates:
- Player paddle: `hue1 = (time * 0.1) % 1`
- Computer paddle: `hue2 = (time * 0.15 + 0.33) % 1`
- Ball: `hue3 = (time * 0.2 + 0.66) % 1`