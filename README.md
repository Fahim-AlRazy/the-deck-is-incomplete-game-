# The Deck is Incomplete - BUCC Recruitment Challenge

An Alice in Borderland inspired Three.js game for BRAC University Computer Club Orientation Summer_25.

---

## Table of Contents

1. [Game Concept](#game-concept)
2. [How to Play](#how-to-play)
3. [Game Features](#game-features)
4. [Technical Implementation](#technical-implementation)
5. [Files & Structure](#files--structure)
6. [Browser Requirements](#browser-requirements)
7. [Customization Ideas](#customization-ideas)
8. [Theme Connection](#theme-connection)
9. [Credits](#credits)

---

## Game Concept

"The Deck is Incomplete" is a 3D first-person exploration game where players must collect missing cards to complete the deck. Inspired by the psychological tension and card-based challenges from Alice in Borderland, players have 40 secondss to:

1. **Collect 13 Spade Cards** - Standard playing cards scattered throughout the 3D world
2. **Acquire 7 Required Skills ( Just joking , you have to earn them all by yourself )** - Special skill cards representing essential BUCC competencies:
   - JavaScript
   - Python
   - Data Structures
   - Algorithms
   - Web Development
   - Problem Solving
   - Teamwork

### What Happens in the Game?

You enter a mysterious, neon-lit world inspired by Alice in Borderland. Cards are hidden in challenging locations, requiring exploration, platforming, and quick thinking. The timer adds urgency, and the HUD keeps you aware of your progress. Collect all cards and skills before time runs out to win and receive a BUCC gift hamper from keya cosmetics !

## Game Features

### Gameplay Mechanics

- **First-Person Controls**: WASD movement + mouse look + sprint (Shift)
- **Time Pressure**: 40-second countdown timer
- **Card Collection**: Click to collect cards within reach
- **Atmospheric 3D World**: Dark, neon-lit environment with obstacles and platforms

#### Detailed Mechanics

- **Movement**: WASD keys for walking, mouse for looking around (Pointer Lock for immersion) + Shift to sprint
- **Card Interaction**: Approach a card and click to collect. Cards disappear with a visual effect.
- **HUD**: Shows collected cards, skills, and remaining time. Progress bar updates in real time.
- **Obstacles**: Some cards are placed on platforms or behind obstacles, requiring navigation and timing.

### Visual Design

- **Alice in Borderland Aesthetic**: Dark backgrounds with neon lighting
- **Dynamic Lighting**: Colored point lights and atmospheric effects
- **Particle Systems**: Floating particles and collection effects
- **Responsive UI**: Real-time HUD showing progress and remaining time

#### How It Works

- The game uses Three.js for all 3D rendering and object placement.
- Cards and skill icons are generated dynamically using Canvas API for unique textures.
- Lighting and particle effects are created with Three.js materials and shaders.

### Win/Lose Conditions

- **Victory**: Collect all 13 cards + 7 skill cards before time runs out
- **Defeat**: Timer reaches zero before completing the deck
- **Reward**: "Game Clear" message and invitation to BUCC interview

---

## How to Play

1. Open `index.html` in a modern web browser
2. Click "Enter the Game" to start
3. Use WASD to move around the 3D world
4. Move mouse to look around (pointer lock enabled)
5. Click on cards to collect them
6. Watch the timer and progress in the HUD
7. Complete the deck before time runs out!

#### Tips

- Explore every corner—some cards are hidden in tricky spots!
- Watch your time and plan your route.
- Skill cards may require solving simple puzzles or reaching special areas.

## Technical Implementation

- **Three.js**: 3D graphics and rendering
- **WebGL**: Hardware-accelerated graphics
- **Pointer Lock API**: First-person camera controls
- **Canvas API**: Dynamic card texture generation
- **Responsive Design**: Adapts to different screen sizes

#### How the Code Works

- `index.html` loads the game and UI.
- `game.js` contains all logic for world generation, card placement, player movement, collision detection, timer, HUD, and win/lose conditions.
- The game loop updates player position, checks for card collisions, and updates the HUD every frame.

## Files & Structure

- `index.html` - Main game page, loads Three.js, sets up UI and pointer lock
- `game.js` - All game logic: world, player, cards, skills, timer, HUD, effects
- `README.md` - This documentation

## Browser Requirements

- Modern browser with WebGL support
- JavaScript enabled
- Mouse and keyboard for controls

## Customization Ideas

- Add more card suits (Hearts, Diamonds, Clubs)
- Implement different skill categories
- Add multiplayer support
- Create different difficulty levels
- Integrate with actual BUCC recruitment system

---

## Theme Connection

This game perfectly captures the BUCC recruitment theme:

- **Strategic Challenge**: Like Alice in Borderland's psychological games
- **Missing Pieces**: "The deck is incomplete" represents the need for new members
- **Skill Requirements**: Players must prove their worth by collecting essential CS skills
- **Time Pressure**: Creates urgency similar to the show's game mechanics

---

---

## Credits

- Developed by Fahim-AlRazy for BRAC University Computer Club (BUCC)
- Inspired by Alice in Borderland
- Built with Three.js, WebGL, and modern web technologies

_Made for BRAC University Computer Club (BUCC) Orientation Summer_25_
