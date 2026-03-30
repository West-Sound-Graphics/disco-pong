# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Workflow

- No build step or package manager is required. The game runs directly from `index.html` in any modern browser.
- To preview changes, simply edit `game.js` and reload the page.
- For local testing with a server (e.g., to test ES modules or CORS), you can use:
  ```bash
  # Using Python (built‑in)
  python -m http.server 8000
  # Then open http://localhost:8000 in the browser
  ```
- If you prefer Node, you can start a simple static server with `npx serve .` or any other static‑file server.

## Useful Git Commands

- Check status: `git status`
- View recent commits: `git log --oneline -5`
- Create a new branch: `git checkout -b <branch-name>`
- Stage changes: `git add <file>`
- Commit:
  ```bash
  git commit -m "Brief summary of changes.

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  ```
- Push to remote (if applicable): `git push -u origin <branch-name>`

## Project Structure (high‑level)

- `index.html` – Entry point; loads Three.js from a CDN and `game.js`.
- `game.js` – Contains all game logic, Three.js scene setup, rendering loop, audio synthesis, and UI controls.
- External dependencies:
  - Three.js r128 (loaded via CDN)
  - Web Audio API (native browser API)

## Architecture Overview

### Rendering Loop
- Driven by `animate()` using `requestAnimationFrame`.
- Handles player paddle input, AI paddle tracking, ball physics, collision detection, and HSL‑based color cycling.

### Audio System
- Initialized via `initAudio()`.
- Procedurally generates a 4‑second disco background loop and sound effects using oscillators and gain nodes.
- No external audio files are required.

### Game State
- Controlled by the `gameStarted` flag.
- Title screen provides configuration for:
  - Ball speed (Slow: 0.08, Mid: 0.15, Fast: 0.24)
  - AI skill level (Easy: 0.06, Normal: 0.1, Hard: 0.15)

### Physics & Collision

- Paddle boundaries: y = -8 to +8.
- Wall boundaries: y = -9.5 to +9.5.
- Collision zones: x = -16 to -14 (player), x = 14 to 16 (computer).
- Scoring: Ball passing x = 20 (player scores) or x = -20 (computer scores).
- Win condition: First to 10 points.

### Color Animation

- Hue values cycled at different rates for player paddle, computer paddle, and ball:
  - Player: `hue1 = (time * 0.1) % 1`
  - Computer: `hue2 = (time * 0.15 + 0.33) % 1`
  - Ball: `hue3 = (time * 0.2 + 0.66) % 1`

## Testing

- No automated test suite exists. Manual verification is performed by opening `index.html` in a browser and playing the game.
- To assist testing, you can open the browser’s developer console to view logs and errors.
- For unit‑style checks, you may add simple assertion scripts or use a test runner of your choice; however, this is not required for basic development.

## Common Modifications

- Adjust ball speed: modify `currentBallSpeed` in `game.js`.
- Change AI difficulty: edit `aiSpeed` or the `aiSkillSelect` dropdown values.
- Update disco color rates: change the multipliers in the hue calculations near the end of `animate()`.
- Add new sound effects: create additional oscillator nodes in `playWallHitSound()` and `playPaddleHitSound()`.