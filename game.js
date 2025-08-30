// The Deck is Incomplete - BUCC En~Queue Challenge
// Alice in Borderland inspired Three.js game

let scene, camera, renderer, controls;
let gameStarted = false;
let gameEnded = false;
let timeLeft = 40; // 40 seconds
let timerInterval;

// Game state
let player = {
  position: new THREE.Vector3(0, 1, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  health: 3,
  cardsCollected: 0,
  skillsCollected: new Set(),
};

// Input handling
let keys = {
  w: false,
  s: false,
  a: false,
  d: false,
  shift: false,
  space: false,
};

// Game objects
let cards = [];
let skillCards = [];
let jokerCards = [];
let obstacles = [];
let lights = [];
let particles = [];

// Required skills for BUCC
const requiredSkills = [
  "Web Development",
  "App Development",
  "Anchoring",
  "Photography",
  "Graphics Design",
  "Motion and Animation",
  "Video Editing",
];

// Card types and their colors
const cardTypes = {
  jokers: 0xff3366,
  spades: 0x000000,
  hearts: 0xff3366,
  diamonds: 0xff6633,
  clubs: 0x003366,
  skill: 0x66ffff,
};

// Initialize the game
function init() {
  // Create scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0a, 10, 100);

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.copy(player.position);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0a0a);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("gameContainer").appendChild(renderer.domElement);

  // Create dramatic sky elements
  createSkyElements();

  // Create world
  createWorld();
  createCards();
  createJokerTrapCards();
  createSkillCards();
  createLighting();
  createParticles();

  // Event listeners
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("click", onMouseClick);
  document.addEventListener("mousemove", onMouseMove);
  window.addEventListener("resize", onWindowResize);

  // Start render loop
  animate();
}

function createWorld() {
  // Create ground
  const groundGeometry = new THREE.PlaneGeometry(200, 200);
  const groundMaterial = new THREE.MeshLambertMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.8,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create walls/barriers
  for (let i = 0; i < 20; i++) {
    const wallGeometry = new THREE.BoxGeometry(
      Math.random() * 3 + 1,
      Math.random() * 5 + 2,
      Math.random() * 3 + 1
    );
    const wallMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color().setHSL(Math.random() * 0.1, 0.5, 0.2),
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);

    wall.position.set(
      (Math.random() - 0.5) * 80,
      wall.geometry.parameters.height / 2,
      (Math.random() - 0.5) * 80
    );

    wall.castShadow = true;
    wall.receiveShadow = true;
    obstacles.push(wall);
    scene.add(wall);
  }

  // Create floating platforms
  for (let i = 0; i < 10; i++) {
    const platformGeometry = new THREE.BoxGeometry(4, 0.5, 4);
    const platformMaterial = new THREE.MeshLambertMaterial({
      color: 0x330033,
      transparent: true,
      opacity: 0.8,
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);

    platform.position.set(
      (Math.random() - 0.5) * 60,
      Math.random() * 8 + 3,
      (Math.random() - 0.5) * 60
    );

    platform.castShadow = true;
    platform.receiveShadow = true;
    obstacles.push(platform);
    scene.add(platform);
  }
}

function createSkyElements() {
  // Create starfield - increased count and visibility
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2,
    transparent: true,
    opacity: 0.9,
  });

  const starVertices = [];
  for (let i = 0; i < 3000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = Math.random() * 1000 + 100;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Create multiple black holes for more dramatic effect
  const blackHoles = [];
  for (let i = 0; i < 3; i++) {
    const blackHoleGeometry = new THREE.SphereGeometry(12, 32, 32);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.95,
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    blackHole.position.set(
      (Math.random() - 0.5) * 200 + 100,
      Math.random() * 50 + 80,
      (Math.random() - 0.5) * 200 - 100
    );
    blackHoles.push(blackHole);
    scene.add(blackHole);

    // Create accretion disk around each black hole
    const diskGeometry = new THREE.RingGeometry(15, 25, 32);
    const diskColors = [0xff3366, 0x3366ff, 0x66ff33];
    const diskMaterial = new THREE.MeshBasicMaterial({
      color: diskColors[i],
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
    accretionDisk.position.copy(blackHole.position);
    accretionDisk.rotation.x = Math.PI / 2;
    scene.add(accretionDisk);
  }

  // Create more planets with better visibility
  const planetColors = [
    0x66ffff, 0xff6666, 0xffff66, 0x66ff66, 0xff66ff, 0xffaa33, 0x33aaff,
    0xaa33ff,
  ];
  for (let i = 0; i < 8; i++) {
    const planetGeometry = new THREE.SphereGeometry(
      Math.random() * 5 + 3,
      20,
      20
    );
    const planetMaterial = new THREE.MeshBasicMaterial({
      color: planetColors[i],
      transparent: true,
      opacity: 0.9,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    planet.position.set(
      (Math.random() - 0.5) * 400,
      Math.random() * 150 + 60,
      (Math.random() - 0.5) * 400
    );

    scene.add(planet);
  }

  // Create more vibrant nebula clouds
  for (let i = 0; i < 12; i++) {
    const cloudGeometry = new THREE.SphereGeometry(20, 12, 12);
    const cloudMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.9, 0.5),
      transparent: true,
      opacity: 0.2,
    });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

    cloud.position.set(
      (Math.random() - 0.5) * 400,
      Math.random() * 150 + 80,
      (Math.random() - 0.5) * 400
    );

    scene.add(cloud);
  }

  // Add floating asteroids for more detail
  for (let i = 0; i < 15; i++) {
    const asteroidGeometry = new THREE.DodecahedronGeometry(
      Math.random() * 2 + 1
    );
    const asteroidMaterial = new THREE.MeshBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.8,
    });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

    asteroid.position.set(
      (Math.random() - 0.5) * 300,
      Math.random() * 100 + 40,
      (Math.random() - 0.5) * 300
    );

    scene.add(asteroid);
  }

  // Store references for animation
  window.skyElements = {
    blackHoles: blackHoles,
    stars: stars,
  };
}

function createCards() {
  // Create regular playing cards (Spades 1-13)
  for (let i = 1; i <= 13; i++) {
    const cardGeometry = new THREE.PlaneGeometry(2.5, 3.5);
    const cardMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      emissive: 0x333333,
    });

    const card = new THREE.Mesh(cardGeometry, cardMaterial);

    // Position cards randomly in the world - more visible locations
    card.position.set(
      (Math.random() - 0.5) * 60,
      Math.random() * 5 + 2,
      (Math.random() - 0.5) * 60
    );

    // Add card number texture
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");

    // Card background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 128, 180);

    // Card border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, 118, 170);

    // Spade symbol
    ctx.fillStyle = "#000000";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("♠", 64, 50);

    // Card number
    ctx.fillStyle = "#000000";
    ctx.font = "bold 30px Arial";
    ctx.fillText(
      i === 1
        ? "A"
        : i === 11
        ? "J"
        : i === 12
        ? "Q"
        : i === 13
        ? "K"
        : i.toString(),
      64,
      100
    );

    const texture = new THREE.CanvasTexture(canvas);
    card.material.map = texture;

    card.userData = { type: "spades", value: i, collected: false };
    card.rotation.y = Math.random() * Math.PI * 2;

    cards.push(card);
    scene.add(card);
  }
}

function createJokerTrapCards() {
  // Create trap joker cards (look almost like spades but with joker symbol)
  for (let i = 1; i <= 5; i++) {
    const cardGeometry = new THREE.PlaneGeometry(2.5, 3.5);
    const cardMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      emissive: 0x333333,
    });

    const jokerCard = new THREE.Mesh(cardGeometry, cardMaterial);

    // Position joker cards randomly in the world
    jokerCard.position.set(
      (Math.random() - 0.5) * 60,
      Math.random() * 5 + 2,
      (Math.random() - 0.5) * 60
    );

    // Create front side (looks like normal card but with joker symbol instead of spade)
    const frontCanvas = document.createElement("canvas");
    frontCanvas.width = 128;
    frontCanvas.height = 180;
    const frontCtx = frontCanvas.getContext("2d");

    // Card background (same as normal cards)
    frontCtx.fillStyle = "#ffffff";
    frontCtx.fillRect(0, 0, 128, 180);

    // Card border (same as normal cards)
    frontCtx.strokeStyle = "#000000";
    frontCtx.lineWidth = 2;
    frontCtx.strokeRect(5, 5, 118, 170);

    // Joker card - no symbol (subtle trap - just empty where spade should be)
    // Skip drawing any symbol - this creates the trap!

    // Random card number (same style as normal cards)
    const randomValue = Math.floor(Math.random() * 13) + 1;
    frontCtx.fillStyle = "#000000";
    frontCtx.font = "bold 30px Arial";
    frontCtx.fillText(
      randomValue === 1
        ? "A"
        : randomValue === 11
        ? "J"
        : randomValue === 12
        ? "Q"
        : randomValue === 13
        ? "K"
        : randomValue.toString(),
      64,
      100
    );

    // Create back side with joker (for the flip animation)
    const backCanvas = document.createElement("canvas");
    backCanvas.width = 128;
    backCanvas.height = 180;
    const backCtx = backCanvas.getContext("2d");

    // Card background (slightly different color)
    backCtx.fillStyle = "#fff0f0";
    backCtx.fillRect(0, 0, 128, 180);

    // Card border
    backCtx.strokeStyle = "#ff3366";
    backCtx.lineWidth = 3;
    backCtx.strokeRect(5, 5, 118, 170);

    // Large laughing joker
    backCtx.fillStyle = "#ff3366";
    backCtx.font = "bold 60px Arial";
    backCtx.textAlign = "center";
    backCtx.fillText("🃏", 64, 90);

    // "JOKER" text
    backCtx.fillStyle = "#000000";
    backCtx.font = "bold 20px Arial";
    backCtx.fillText("JOKER", 64, 130);

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    const backTexture = new THREE.CanvasTexture(backCanvas);

    jokerCard.material.map = frontTexture;
    jokerCard.userData = {
      type: "joker",
      value: randomValue,
      collected: false,
      frontTexture: frontTexture,
      backTexture: backTexture,
      isFlipped: false,
    };
    jokerCard.rotation.y = Math.random() * Math.PI * 2;

    jokerCards.push(jokerCard);
    scene.add(jokerCard);
  }
}

function createSkillCards() {
  // Create skill cards
  requiredSkills.forEach((skill, index) => {
    const cardGeometry = new THREE.PlaneGeometry(2.8, 3.8);
    const cardMaterial = new THREE.MeshLambertMaterial({
      color: 0x66ffff,
      transparent: true,
      opacity: 1.0,
      emissive: 0x006666,
    });

    const skillCard = new THREE.Mesh(cardGeometry, cardMaterial);

    // Position skill cards in more visible but still challenging places
    skillCard.position.set(
      (Math.random() - 0.5) * 70,
      Math.random() * 8 + 3,
      (Math.random() - 0.5) * 70
    );

    // Add skill text texture
    const canvas = document.createElement("canvas");
    canvas.width = 144;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    // Card background
    ctx.fillStyle = "#003366";
    ctx.fillRect(0, 0, 144, 200);

    // Card border
    ctx.strokeStyle = "#66ffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, 134, 190);

    // BUCC logo area
    ctx.fillStyle = "#66ffff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("BUCC", 72, 30);

    // Skill name
    ctx.font = "bold 16px Arial";
    const words = skill.split(" ");
    words.forEach((word, i) => {
      ctx.fillText(word, 72, 80 + i * 20);
    });

    // Requirement indicator
    ctx.font = "12px Arial";
    ctx.fillText("REQUIRED", 72, 150);
    ctx.fillText("SKILL", 72, 165);

    const texture = new THREE.CanvasTexture(canvas);
    skillCard.material.map = texture;

    skillCard.userData = { type: "skill", skill: skill, collected: false };
    skillCard.rotation.y = Math.random() * Math.PI * 2;

    skillCards.push(skillCard);
    scene.add(skillCard);
  });
}

function createLighting() {
  // Brighter ambient light for better card visibility
  const ambientLight = new THREE.AmbientLight(0x606060, 0.6);
  scene.add(ambientLight);

  // Main spotlight - brighter
  const spotlight = new THREE.SpotLight(0xff6666, 1.5, 100, Math.PI / 4, 0.3);
  spotlight.position.set(0, 25, 0);
  spotlight.target.position.set(0, 0, 0);
  spotlight.castShadow = true;
  spotlight.shadow.mapSize.width = 2048;
  spotlight.shadow.mapSize.height = 2048;
  scene.add(spotlight);
  scene.add(spotlight.target);

  // More colored point lights for better visibility
  const colors = [0xff3366, 0x66ffff, 0xffff66, 0x66ff66];
  for (let i = 0; i < 12; i++) {
    const light = new THREE.PointLight(colors[i % colors.length], 0.8, 40);
    light.position.set(
      (Math.random() - 0.5) * 80,
      Math.random() * 8 + 5,
      (Math.random() - 0.5) * 80
    );
    lights.push(light);
    scene.add(light);
  }
}

function createParticles() {
  // Create floating particles for atmosphere
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 200;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x66ffff,
    size: 0.5,
    transparent: true,
    opacity: 0.6,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);
  particles.push(particleSystem);
}

function startGame() {
  gameStarted = true;
  gameEnded = false;
  document.getElementById("gameTitle").style.display = "none";
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("gameWin").style.display = "none";

  // Reset mouse values for clean start
  mouseX = 0;
  mouseY = 0;

  // Start timer
  timerInterval = setInterval(updateTimer, 1000);

  // Lock pointer for first-person controls
  renderer.domElement.requestPointerLock();
}

function restartGame() {
  // Reset game state
  player.health = 3;
  player.cardsCollected = 0;
  player.skillsCollected.clear();
  player.position.set(0, 1, 0);
  timeLeft = 40; // 40 seconds

  // Reset mouse rotation
  mouseX = 0;
  mouseY = 0;

  // Reset cards
  cards.forEach((card) => {
    card.userData.collected = false;
    card.visible = true;
  });

  skillCards.forEach((card) => {
    card.userData.collected = false;
    card.visible = true;
  });

  jokerCards.forEach((card) => {
    card.userData.collected = false;
    card.userData.isFlipped = false;
    card.material.map = card.userData.frontTexture;
    card.visible = true;
  });

  updateHUD();
  startGame();
}

function updateTimer() {
  timeLeft--;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").textContent = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  if (timeLeft <= 0) {
    endGame(false);
  }
}

function endGame(won) {
  gameEnded = true;
  clearInterval(timerInterval);
  document.exitPointerLock();

  if (won) {
    // Update win screen with collected skills
    updateWinSkills();
    document.getElementById("gameWin").style.display = "block";
  } else {
    // Update game over screen with collected skills
    updateGameOverSkills();
    document.getElementById("gameOver").style.display = "block";
  }
}

function updateWinSkills() {
  const skillsList = document.getElementById("skillsLearned");
  skillsList.innerHTML = "";

  player.skillsCollected.forEach((skill) => {
    const skillItem = document.createElement("div");
    skillItem.style.color = "#66ff66";
    skillItem.style.margin = "5px 0";
    skillItem.textContent = `✓ ${skill}`;
    skillsList.appendChild(skillItem);
  });
}

function updateGameOverSkills() {
  const skillsList = document.getElementById("skillsObtained");
  skillsList.innerHTML = "";

  if (player.skillsCollected.size > 0) {
    player.skillsCollected.forEach((skill) => {
      const skillItem = document.createElement("div");
      skillItem.style.color = "#66ffff";
      skillItem.style.margin = "5px 0";
      skillItem.textContent = `✓ ${skill}`;
      skillsList.appendChild(skillItem);
    });
  } else {
    const noSkills = document.createElement("div");
    noSkills.style.color = "#ff6666";
    noSkills.textContent = "No skills obtained";
    skillsList.appendChild(noSkills);
  }
}

function updateHUD() {
  document.getElementById("cardCount").textContent = player.cardsCollected;
  document.getElementById("skillCount").textContent =
    player.skillsCollected.size;
  document.getElementById("lives").textContent = player.health;
}

function checkWinCondition() {
  if (player.cardsCollected >= 13 && player.skillsCollected.size >= 7) {
    endGame(true);
  }
}

// Input handling
function onKeyDown(event) {
  if (!gameStarted || gameEnded) return;

  switch (event.code) {
    case "KeyW":
      keys.w = true;
      break;
    case "KeyS":
      keys.s = true;
      break;
    case "KeyA":
      keys.a = true;
      break;
    case "KeyD":
      keys.d = true;
      break;
    case "ShiftLeft":
      keys.shift = true;
      break;
    case "Space":
      keys.space = true;
      event.preventDefault();
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case "KeyW":
      keys.w = false;
      break;
    case "KeyS":
      keys.s = false;
      break;
    case "KeyA":
      keys.a = false;
      break;
    case "KeyD":
      keys.d = false;
      break;
    case "ShiftLeft":
      keys.shift = false;
      break;
    case "Space":
      keys.space = false;
      break;
  }
}

let mouseX = 0,
  mouseY = 0;
function onMouseMove(event) {
  if (!gameStarted || gameEnded) return;

  if (document.pointerLockElement === renderer.domElement) {
    // Improved mouse sensitivity and movement
    const sensitivity = 0.003;
    mouseX -= event.movementX * sensitivity;
    mouseY -= event.movementY * sensitivity; // Back to - for proper FPS controls

    // Clamp vertical rotation to prevent over-rotation
    mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseY));
  }
}

function onMouseClick(event) {
  if (!gameStarted || gameEnded) return;

  // Raycast to detect card clicks
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

  const allCards = [...cards, ...skillCards, ...jokerCards];
  const intersects = raycaster.intersectObjects(allCards);

  if (intersects.length > 0) {
    const clickedCard = intersects[0].object;
    if (!clickedCard.userData.collected) {
      if (clickedCard.userData.type === "joker") {
        hitJokerCard(clickedCard);
      } else {
        collectCard(clickedCard);
      }
    }
  }
}

function collectCard(card) {
  card.userData.collected = true;
  card.visible = false;

  if (card.userData.type === "skill") {
    player.skillsCollected.add(card.userData.skill);

    // Show skill collected message
    showSkillLabel(card.userData.skill);
  } else {
    player.cardsCollected++;
  }

  updateHUD();
  checkWinCondition();

  // Add collection effect
  createCollectionEffect(card.position);
}

function hitJokerCard(jokerCard) {
  // Flip the card to show joker side
  jokerCard.material.map = jokerCard.userData.backTexture;
  jokerCard.userData.isFlipped = true;

  // Reduce player life
  player.health--;
  updateHUD();

  // Show laughing joker animation
  showJokerLaugh(jokerCard.position);

  // Create negative effect
  createJokerEffect(jokerCard.position);

  // Remove the joker card after animation
  setTimeout(() => {
    jokerCard.userData.collected = true;
    jokerCard.visible = false;
  }, 1000);

  // Check if game over
  if (player.health <= 0) {
    setTimeout(() => {
      endGame(false);
    }, 1000);
  }
}

function showJokerLaugh(position) {
  // Create floating laughing joker text
  const jokerDiv = document.createElement("div");
  jokerDiv.style.position = "absolute";
  jokerDiv.style.left = "50%";
  jokerDiv.style.top = "40%";
  jokerDiv.style.transform = "translate(-50%, -50%)";
  jokerDiv.style.fontSize = "72px";
  jokerDiv.style.color = "#ff3366";
  jokerDiv.style.textShadow = "0 0 20px #ff3366";
  jokerDiv.style.animation = "jokerLaugh 1s ease-out";
  jokerDiv.style.pointerEvents = "none";
  jokerDiv.style.zIndex = "1000";
  jokerDiv.textContent = "🃏 HAHAHA!";

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes jokerLaugh {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
    }
  `;
  document.head.appendChild(style);

  document.getElementById("ui").appendChild(jokerDiv);

  setTimeout(() => {
    jokerDiv.remove();
    style.remove();
  }, 1000);
}

function createJokerEffect(position) {
  const geometry = new THREE.SphereGeometry(0.1, 8, 8);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff3366,
    transparent: true,
    opacity: 1,
  });

  for (let i = 0; i < 15; i++) {
    const particle = new THREE.Mesh(geometry, material.clone());
    particle.position.copy(position);
    particle.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        Math.random() * 0.4,
        (Math.random() - 0.5) * 0.3
      ),
      life: 1,
      isJokerEffect: true,
    };
    scene.add(particle);
  }
}

function showSkillLabel(skill) {
  const label = document.createElement("div");
  label.className = "skill-label";
  label.textContent = `${skill} Acquired!`;
  label.style.left = "50%";
  label.style.top = "30%";
  label.style.transform = "translateX(-50%)";

  document.getElementById("ui").appendChild(label);

  setTimeout(() => {
    label.remove();
  }, 2000);
}

function createCollectionEffect(position) {
  const geometry = new THREE.SphereGeometry(0.1, 8, 8);
  const material = new THREE.MeshBasicMaterial({
    color: 0x66ffff,
    transparent: true,
    opacity: 1,
  });

  for (let i = 0; i < 10; i++) {
    const particle = new THREE.Mesh(geometry, material.clone());
    particle.position.copy(position);
    particle.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        Math.random() * 0.3,
        (Math.random() - 0.5) * 0.2
      ),
      life: 1,
    };
    scene.add(particle);
  }
}

function updatePlayer() {
  if (!gameStarted || gameEnded) return;

  const speed = keys.shift ? 0.2 : 0.1;
  const direction = new THREE.Vector3();

  if (keys.w) direction.z -= speed;
  if (keys.s) direction.z += speed;
  if (keys.a) direction.x -= speed;
  if (keys.d) direction.x += speed;

  // Apply camera rotation to movement
  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), mouseX);

  // Update position
  player.position.add(direction);

  // Simple collision detection with world bounds
  player.position.x = Math.max(-90, Math.min(90, player.position.x));
  player.position.z = Math.max(-90, Math.min(90, player.position.z));
  player.position.y = Math.max(1, player.position.y);

  // Update camera position and rotation
  camera.position.copy(player.position);

  // Apply rotations in proper order for FPS controls
  camera.rotation.order = "YXZ";
  camera.rotation.y = mouseX;
  camera.rotation.x = mouseY;
}

function updateAnimations() {
  const time = Date.now() * 0.001;

  // Animate sky elements
  if (window.skyElements) {
    // Rotate multiple black holes
    if (window.skyElements.blackHoles) {
      window.skyElements.blackHoles.forEach((blackHole, index) => {
        blackHole.rotation.y += 0.005 + index * 0.001;
        blackHole.rotation.x += 0.002 + index * 0.0005;
      });
    }

    // Make stars twinkle more dramatically
    window.skyElements.stars.rotation.y += 0.0008;
    window.skyElements.stars.material.opacity = 0.7 + Math.sin(time * 3) * 0.3;
  }

  // Animate cards (same animation for all cards)
  [...cards, ...skillCards, ...jokerCards].forEach((card, index) => {
    if (!card.userData.collected) {
      card.rotation.y += 0.02;
      card.position.y += Math.sin(time * 2 + index) * 0.01;
    }
  });

  // Animate lights
  lights.forEach((light, index) => {
    light.intensity = 0.5 + Math.sin(time * 3 + index) * 0.2;
    light.position.y += Math.sin(time * 2 + index) * 0.05;
  });

  // Animate particles
  particles.forEach((system) => {
    const positions = system.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time + positions[i]) * 0.01;
    }
    system.geometry.attributes.position.needsUpdate = true;
  });

  // Update collection effect particles
  scene.children.forEach((child) => {
    if (child.userData && child.userData.life !== undefined) {
      child.userData.life -= 0.02;
      child.position.add(child.userData.velocity);
      child.userData.velocity.y -= 0.01; // gravity
      child.material.opacity = child.userData.life;

      if (child.userData.life <= 0) {
        scene.remove(child);
      }
    }
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  updatePlayer();
  updateAnimations();

  renderer.render(scene, camera);
}

// Initialize when page loads
init();
