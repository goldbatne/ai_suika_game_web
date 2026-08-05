import Matter from "matter-js";
import "./styles.css";

const {
  Body,
  Bodies,
  Composite,
  Engine,
  Events,
  Runner,
  Sleeping,
  World,
} = Matter;

const canvas = document.querySelector<HTMLCanvasElement>("#game");
if (!canvas) throw new Error("Canvas not found");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("2D context not found");

const scoreEl = document.querySelector<HTMLElement>("#score")!;
const bestEl = document.querySelector<HTMLElement>("#best")!;
const coinsEl = document.querySelector<HTMLElement>("#coins")!;
const shakesEl = document.querySelector<HTMLElement>("#shakes")!;
const nextFruitEl = document.querySelector<HTMLImageElement>("#nextFruit")!;
const countdownEl = document.querySelector<HTMLElement>("#countdown")!;
const countdownTextEl = document.querySelector<HTMLElement>("#countdownText")!;
const messageEl = document.querySelector<HTMLElement>("#message")!;
const gameOverEl = document.querySelector<HTMLElement>("#gameOver")!;
const finalScoreEl = document.querySelector<HTMLElement>("#finalScore")!;
const shopEl = document.querySelector<HTMLElement>("#shop")!;
const optionEl = document.querySelector<HTMLElement>("#option")!;
const titleScreenEl = document.querySelector<HTMLElement>("#titleScreen")!;
const gameUiEl = document.querySelector<HTMLElement>("#gameUi")!;
const titleBestEl = document.querySelector<HTMLElement>("#titleBest")!;

const UNIT = 100;
const HALF_WIDTH = 2.7;
const TOP_Y = 4.8;
const FLOOR_Y = -4;
const DEAD_ZONE_Y = 2.5;
const SPAWN_Y = 3.12;
const DROP_X_LIMIT = 1.85;
const START_RANGE = 4;
const FRUIT_SIZE_MULTIPLIER = 1.22;
const FRUIT_VISUAL_DIAMETER_RATIO = 0.88;

const FRUIT_MATTER = {
  friction: 0.2,
  restitution: 0.4,
  frictionAir: 0.002,
};

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const fruits = [
  { name: "Fruit_01", level: 0, scale: 0.28, mass: 0.3, src: assetPath("assets/fruits/fruit_01.png"), rect: { x: 260, y: 46, width: 146, height: 308 } },
  { name: "Fruit_02", level: 1, scale: 0.327, mass: 0.5, src: assetPath("assets/fruits/fruit_02.png"), rect: { x: 266, y: 72, width: 136, height: 238 } },
  { name: "Fruit_03", level: 2, scale: 0.382, mass: 0.7, src: assetPath("assets/fruits/fruit_03.png"), rect: { x: 272, y: 90, width: 132, height: 208 } },
  { name: "Fruit_04", level: 3, scale: 0.447, mass: 1, src: assetPath("assets/fruits/fruit_04.png"), rect: { x: 279, y: 76, width: 126, height: 225 } },
  { name: "Fruit_05", level: 4, scale: 0.522, mass: 1.3, src: assetPath("assets/fruits/fruit_05.png"), rect: { x: 281, y: 84, width: 117, height: 226 } },
  { name: "Fruit_06", level: 5, scale: 0.61, mass: 1.8, src: assetPath("assets/fruits/fruit_06.png"), rect: { x: 289, y: 92, width: 108, height: 188 } },
  { name: "Fruit_07", level: 6, scale: 0.713, mass: 2.3, src: assetPath("assets/fruits/fruit_07.png"), rect: { x: 278, y: 78, width: 123, height: 203 } },
  { name: "Fruit_08", level: 7, scale: 0.834, mass: 2.8, src: assetPath("assets/fruits/fruit_08.png"), rect: { x: 280, y: 78, width: 117, height: 204 } },
  { name: "Fruit_09", level: 8, scale: 0.975, mass: 3.8, src: assetPath("assets/fruits/fruit_09.png"), rect: { x: 253, y: 75, width: 167, height: 208 } },
  { name: "Fruit_10", level: 9, scale: 1.139, mass: 4.5, src: assetPath("assets/fruits/fruit_10.png"), rect: { x: 285, y: 75, width: 120, height: 203 } },
  { name: "Fruit_11", level: 10, scale: 1.331, mass: 5.5, src: assetPath("assets/fruits/fruit_11.png"), rect: { x: 258, y: 74, width: 162, height: 205 } },
];

type FruitBody = Matter.Body & {
  fruitLevel?: number;
  fruitName?: string;
  radiusWorld?: number;
  dropped?: boolean;
  merging?: boolean;
  current?: boolean;
  popStart?: number;
};

const images = new Map<string, HTMLImageElement>();
const previews = new Map<string, string>();
const background = new Image();
background.src = assetPath("assets/ui/background.jpg");

const sounds = {
  bgm: new Audio(assetPath("assets/audio/bgm.mp3")),
  drop: new Audio(assetPath("assets/audio/drop.mp3")),
  merge: new Audio(assetPath("assets/audio/merge.mp3")),
};
sounds.bgm.loop = true;
sounds.bgm.volume = 0.45;
sounds.drop.volume = 0.7;

const engine = Engine.create();
engine.gravity.y = 1;
const runner = Runner.create();

let currentFruit: FruitBody | null = null;
let nextFruitIndex = randomStartIndex();
let ready = false;
let score = 0;
let best = Number(localStorage.getItem("BestScore") || 0);
let coins = 0;
let shakeCount = 1;
let deadTimer = 0;
let gameOver = false;
let scene: "title" | "game" = "title";
let messageTimeout = 0;
let shakeFrames = 0;
let shakeMagnitude = 0;

function worldToScreen(x: number, y: number) {
  return {
    x: (x + HALF_WIDTH) * UNIT,
    y: (TOP_Y - y) * UNIT,
  };
}

function screenToWorldX(screenX: number) {
  return screenX / UNIT - HALF_WIDTH;
}

function randomStartIndex() {
  return Math.floor(Math.random() * START_RANGE);
}

function fruitScale(fruit: { scale: number }) {
  return fruit.scale * FRUIT_SIZE_MULTIPLIER;
}

function loadImages() {
  for (const fruit of fruits) {
    const image = new Image();
    image.src = fruit.src;
    image.addEventListener("load", () => {
      previews.set(fruit.src, makePreview(image, fruit));
      if (nextFruitEl.dataset.src === fruit.src) nextFruitEl.src = previews.get(fruit.src) ?? fruit.src;
    });
    images.set(fruit.src, image);
  }
}

function makePreview(image: HTMLImageElement, fruit: (typeof fruits)[number]) {
  const preview = document.createElement("canvas");
  preview.width = fruit.rect.width;
  preview.height = fruit.rect.height;
  const previewCtx = preview.getContext("2d");
  if (!previewCtx) return fruit.src;
  const sourceY = image.naturalHeight - fruit.rect.y - fruit.rect.height;
  previewCtx.drawImage(
    image,
    fruit.rect.x,
    sourceY,
    fruit.rect.width,
    fruit.rect.height,
    0,
    0,
    fruit.rect.width,
    fruit.rect.height,
  );
  return preview.toDataURL("image/png");
}

function initWorld() {
  World.clear(engine.world, false);
  Engine.clear(engine);
  engine.gravity.y = 1;

  addWall(0, FLOOR_Y, 15, 0.6, "floor");
  addWall(-2.4, -0.2, 0.2, 7.5, "left-wall");
  addWall(2.4, -0.2, 0.2, 7.5, "right-wall");
  addWall(-2.4, 13.5, 0.2, 21, "left-wall-ext");
  addWall(2.4, 13.5, 0.2, 21, "right-wall-ext");
}

function addWall(x: number, y: number, width: number, height: number, label: string) {
  const pos = worldToScreen(x, y);
  const body = Bodies.rectangle(pos.x, pos.y, width * UNIT, height * UNIT, {
    isStatic: true,
    label,
    friction: 0.1,
    restitution: 0,
    render: { visible: false },
  });
  Composite.add(engine.world, body);
}

function createFruit(index: number, xWorld = 0, yWorld = SPAWN_Y, isCurrent = false): FruitBody {
  const fruit = fruits[index];
  const pos = worldToScreen(xWorld, yWorld);
  const scale = fruitScale(fruit);
  const radius = scale * UNIT;
  const body = Bodies.circle(pos.x, pos.y, radius, {
    ...FRUIT_MATTER,
    label: fruit.name,
  }) as FruitBody;

  body.fruitLevel = fruit.level;
  body.fruitName = fruit.name;
  body.radiusWorld = scale;
  body.dropped = !isCurrent;
  body.current = isCurrent;
  Body.setMass(body, fruit.mass);
  Body.setStatic(body, isCurrent);
  Composite.add(engine.world, body);
  return body;
}

function spawnNextFruit() {
  if (gameOver || scene !== "game") return;
  const index = nextFruitIndex;
  currentFruit = createFruit(index, 0, SPAWN_Y, true);
  nextFruitIndex = randomStartIndex();
  setNextPreview();
  ready = true;
}

function setNextPreview() {
  const fruit = fruits[nextFruitIndex];
  nextFruitEl.dataset.src = fruit.src;
  nextFruitEl.src = previews.get(fruit.src) ?? fruit.src;
}

function dropFruit() {
  if (!ready || !currentFruit || gameOver) return;
  unlockAudio();
  currentFruit.current = false;
  currentFruit.dropped = true;
  Body.setStatic(currentFruit, false);
  Body.applyForce(currentFruit, currentFruit.position, { x: 0, y: 0.004 });
  playSound(sounds.drop);
  currentFruit = null;
  ready = false;
  window.setTimeout(spawnNextFruit, 1000);
}

function unlockAudio() {
  if (sounds.bgm.paused) {
    void sounds.bgm.play().catch(() => undefined);
  }
}

function playSound(audio: HTMLAudioElement) {
  audio.currentTime = 0;
  void audio.play().catch(() => undefined);
}

function stopAllAudio() {
  for (const audio of Object.values(sounds)) {
    audio.pause();
    audio.currentTime = 0;
  }
}

function mergeFruit(a: FruitBody, b: FruitBody) {
  if (a.merging || b.merging || a.fruitLevel == null || b.fruitLevel == null) return;
  if (!a.dropped || !b.dropped || a.fruitLevel !== b.fruitLevel) return;

  a.merging = true;
  b.merging = true;
  const level = a.fruitLevel;
  const spawn = {
    x: (a.position.x + b.position.x) / 2,
    y: (a.position.y + b.position.y) / 2,
  };

  Composite.remove(engine.world, a);
  Composite.remove(engine.world, b);
  playSound(sounds.merge);
  burst(spawn.x, spawn.y, level);

  if (level >= 3) {
    startShake(0.15, level * 5);
  }

  if (level < fruits.length - 1) {
    const worldX = screenToWorldX(spawn.x);
    const worldY = TOP_Y - spawn.y / UNIT;
    const next = createFruit(level + 1, worldX, worldY, false);
    next.popStart = performance.now();
    Body.applyForce(next, next.position, { x: 0, y: -0.02 });
    addScore(10 * (level + 1));
  } else {
    addScore(100);
  }
}

const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; life: number; color: string }> = [];
const shockwaves: Array<{ x: number; y: number; life: number; maxRadius: number }> = [];

function burst(x: number, y: number, level: number) {
  const colors = ["#fff8d7", "#ffe56f", "#ff8a5b", "#ffffff", "#7ed957"];
  shockwaves.push({ x, y, life: 1, maxRadius: 34 + level * 4 });
  for (let i = 0; i < 26; i += 1) {
    const angle = (Math.PI * 2 * i) / 26 + Math.random() * 0.45;
    const speed = 2.2 + Math.random() * 4.8;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 3 + Math.random() * 7,
      life: 1,
      color: colors[(level + i) % colors.length],
    });
  }
}

function addScore(amount: number) {
  score += amount;
  coins += Math.floor(amount / 10);
  if (score > best) {
    best = score;
    localStorage.setItem("BestScore", String(best));
  }
  updateHud();
}

function buyShake() {
  if (coins >= 20) {
    coins -= 20;
    shakeCount += 1;
    updateHud();
    showMessage("Shake +1");
  } else {
    showMessage("Not enough coins!");
  }
}

function useShake() {
  if (gameOver) return;
  unlockAudio();
  if (shakeCount <= 0) {
    showMessage("Out of Shakes!");
    return;
  }
  shakeCount -= 1;
  updateHud();
  startShake(0.65, 120);

  for (const body of Composite.allBodies(engine.world) as FruitBody[]) {
    if (body.isStatic || body.fruitLevel == null) continue;
    const worldY = TOP_Y - body.position.y / UNIT;
    if (worldY >= DEAD_ZONE_Y) continue;
    const worldX = screenToWorldX(body.position.x);
    const toCenterX = clamp(-worldX, -1, 1);
    const randomX = Math.random() * 1.4 - 0.7;
    const horizontal = clamp(toCenterX + randomX, -1.25, 1.25);
    const upward = 4.2 + Math.random() * 1.8;
    const sideKick = horizontal * (5.2 + Math.random() * 2.8);
    const forceScale = 0.0012 * body.mass;
    Body.applyForce(body, body.position, {
      x: horizontal * 18 * forceScale,
      y: -0.55 * 18 * forceScale,
    });
    Body.setVelocity(body, {
      x: clamp(body.velocity.x + sideKick, -9, 9),
      y: clamp(body.velocity.y - upward, -8, 4),
    });
    Body.setAngularVelocity(body, body.angularVelocity + (Math.random() * 2 - 1) * 1.15);
    Sleeping.set(body, false);
  }
}

function normalize(x: number, y: number) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function startShake(seconds: number, magnitude: number) {
  shakeFrames = Math.max(shakeFrames, Math.round(seconds * 60));
  shakeMagnitude = Math.max(shakeMagnitude, magnitude);
}

function showMessage(text: string) {
  messageEl.textContent = text;
  messageEl.hidden = false;
  window.clearTimeout(messageTimeout);
  messageTimeout = window.setTimeout(() => {
    messageEl.hidden = true;
  }, 1500);
}

function updateHud() {
  scoreEl.textContent = `Score: ${score}`;
  bestEl.textContent = `Best: ${best}`;
  titleBestEl.textContent = `Best: ${best}`;
  coinsEl.textContent = `coin : ${coins}`;
  shakesEl.textContent = `count : ${shakeCount}`;
}

function updateCurrentFruit(pointerX: number) {
  if (!currentFruit || !ready || gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((pointerX - rect.left) / rect.width) * canvas.width;
  const worldX = clamp(screenToWorldX(x), -DROP_X_LIMIT, DROP_X_LIMIT);
  const pos = worldToScreen(worldX, SPAWN_Y);
  Body.setPosition(currentFruit, pos);
}

function updateDeadZone(deltaMs: number) {
  const bodies = Composite.allBodies(engine.world) as FruitBody[];
  const hasFruitInZone = bodies.some((body) => {
    if (body.fruitLevel == null || body.current || !body.dropped) return false;
    const worldY = TOP_Y - body.position.y / UNIT;
    const radius = body.radiusWorld ?? 0;
    return worldY + radius >= DEAD_ZONE_Y - 0.05;
  });

  if (hasFruitInZone) {
    deadTimer += deltaMs / 1000;
    const remaining = Math.max(0, 7 - deadTimer);
    if (remaining <= 5) {
      countdownEl.hidden = false;
      countdownTextEl.textContent = String(Math.ceil(remaining));
      countdownEl.style.setProperty("--countdown", String(remaining / 5));
    }
    if (deadTimer >= 7) {
      endGame();
    }
  } else {
    deadTimer = 0;
    countdownEl.hidden = true;
  }
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  finalScoreEl.textContent = `Score: ${score}`;
  gameOverEl.hidden = false;
  Runner.stop(runner);
}

function startGame() {
  Runner.stop(runner);
  scene = "game";
  score = 0;
  coins = 0;
  shakeCount = 1;
  deadTimer = 0;
  gameOver = false;
  ready = false;
  currentFruit = null;
  titleScreenEl.hidden = true;
  gameUiEl.hidden = false;
  gameOverEl.hidden = true;
  shopEl.hidden = true;
  optionEl.hidden = true;
  countdownEl.hidden = true;
  particles.length = 0;
  initWorld();
  nextFruitIndex = randomStartIndex();
  updateHud();
  spawnNextFruit();
  Runner.run(runner, engine);
}

function restart() {
  startGame();
}

function goTitle() {
  stopAllAudio();
  scene = "title";
  gameOver = false;
  ready = false;
  currentFruit = null;
  deadTimer = 0;
  Runner.stop(runner);
  World.clear(engine.world, false);
  Engine.clear(engine);
  titleScreenEl.hidden = false;
  gameUiEl.hidden = true;
  gameOverEl.hidden = true;
  shopEl.hidden = true;
  optionEl.hidden = true;
  countdownEl.hidden = true;
  updateHud();
}

Events.on(engine, "collisionStart", (event) => {
  for (const pair of event.pairs) {
    const a = pair.bodyA as FruitBody;
    const b = pair.bodyB as FruitBody;
    if (a.fruitLevel == null || b.fruitLevel == null) continue;
    if ((a.id ?? 0) < (b.id ?? 0)) mergeFruit(a, b);
    else mergeFruit(b, a);
  }
});

let lastTime = performance.now();

function draw(time = performance.now()) {
  const delta = time - lastTime;
  lastTime = time;
  if (scene === "game" && !gameOver) updateDeadZone(delta);

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let offsetX = 0;
  let offsetY = 0;
  if (shakeFrames > 0) {
    offsetX = (Math.random() * 2 - 1) * shakeMagnitude;
    offsetY = (Math.random() * 2 - 1) * shakeMagnitude;
    shakeFrames -= 1;
    shakeMagnitude *= 0.95;
  }

  drawBackground();
  ctx.translate(offsetX, offsetY);
  if (scene === "game") {
    drawBounds();
  drawDeadZone();
  drawBodies();
  drawShockwaves(delta);
  drawParticles(delta);
  }
  ctx.restore();

  requestAnimationFrame(draw);
}

function drawBackground() {
  if (background.complete && background.naturalWidth > 0) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#f7d969");
    gradient.addColorStop(0.45, "#f6a65f");
    gradient.addColorStop(1, "#6db6b0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawBounds() {
  ctx.fillStyle = "rgba(49, 37, 30, 0.82)";
  const left = worldToScreen(-2.4, -0.2);
  const right = worldToScreen(2.4, -0.2);
  const floor = worldToScreen(0, FLOOR_Y);
  roundRect(left.x - 10, left.y - 375, 20, 750, 9);
  roundRect(right.x - 10, right.y - 375, 20, 750, 9);
  roundRect(floor.x - 255, floor.y - 18, 510, 36, 12);
}

function drawDeadZone() {
  const y = worldToScreen(0, DEAD_ZONE_Y).y;
  ctx.save();
  ctx.strokeStyle = deadTimer > 0 ? "rgba(255, 54, 87, 0.95)" : "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = deadTimer > 0 ? 4 : 2;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(30, y);
  ctx.lineTo(canvas.width - 30, y);
  ctx.stroke();
  ctx.restore();
}

function drawBodies() {
  const now = performance.now();
  for (const body of Composite.allBodies(engine.world) as FruitBody[]) {
    if (body.fruitLevel == null) continue;
    const fruit = fruits[body.fruitLevel];
    const image = images.get(fruit.src);
    const scale = fruitScale(fruit);
    const radius = scale * UNIT;

    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    if (body.popStart) {
      const t = Math.min(1, (now - body.popStart) / 180);
      const pop = t < 0.55 ? 0.45 + t * 1.35 : 1.18 - (t - 0.55) * 0.4;
      ctx.scale(pop, pop);
      if (t >= 1) body.popStart = undefined;
    }

    if (image?.complete && image.naturalWidth > 0) {
      drawUnitySprite(image, fruit);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawUnitySprite(image: HTMLImageElement, fruit: (typeof fruits)[number]) {
  const sourceY = image.naturalHeight - fruit.rect.y - fruit.rect.height;
  const aspect = fruit.rect.width / fruit.rect.height;
  const maxWorldSize = fruitScale(fruit) * 2 * FRUIT_VISUAL_DIAMETER_RATIO;
  let width = maxWorldSize;
  let height = maxWorldSize;
  if (aspect > 1) height = width / aspect;
  else width = height * aspect;
  ctx.drawImage(
    image,
    fruit.rect.x,
    sourceY,
    fruit.rect.width,
    fruit.rect.height,
    (-width * UNIT) / 2,
    (-height * UNIT) / 2,
    width * UNIT,
    height * UNIT,
  );
}

function drawShockwaves(deltaMs: number) {
  for (let i = shockwaves.length - 1; i >= 0; i -= 1) {
    const wave = shockwaves[i];
    wave.life -= deltaMs / 260;
    if (wave.life <= 0) {
      shockwaves.splice(i, 1);
      continue;
    }
    const progress = 1 - wave.life;
    ctx.save();
    ctx.globalAlpha = wave.life * 0.8;
    ctx.strokeStyle = "#fff8d7";
    ctx.lineWidth = 4 * wave.life;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, wave.maxRadius * progress, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawParticles(deltaMs: number) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.life -= deltaMs / 360;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.94;
    particle.vy *= 0.94;
    if (particle.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    ctx.globalAlpha = Math.max(0, particle.life);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * particle.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function roundRect(x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

canvas.addEventListener("pointermove", (event) => updateCurrentFruit(event.clientX));
canvas.addEventListener("pointerdown", (event) => {
  updateCurrentFruit(event.clientX);
  dropFruit();
});

document.querySelector("#shakeButton")?.addEventListener("click", useShake);
document.querySelector("#playAgainButton")?.addEventListener("click", restart);
document.querySelector("#startButton")?.addEventListener("click", () => {
  unlockAudio();
  startGame();
});
document.querySelector("#goTitleButton")?.addEventListener("click", goTitle);
document.querySelector("#optionTitleButton")?.addEventListener("click", goTitle);
document.querySelector("#optionNewGameButton")?.addEventListener("click", restart);
document.querySelector("#shopButton")?.addEventListener("click", () => {
  unlockAudio();
  shopEl.hidden = false;
});
document.querySelector("#optionButton")?.addEventListener("click", () => {
  unlockAudio();
  optionEl.hidden = false;
});
document.querySelector("#closeShopButton")?.addEventListener("click", () => {
  shopEl.hidden = true;
});
document.querySelector("#closeOptionButton")?.addEventListener("click", () => {
  optionEl.hidden = true;
});
document.querySelector("#buyShakeButton")?.addEventListener("click", buyShake);
document.querySelector<HTMLInputElement>("#volumeSlider")?.addEventListener("input", (event) => {
  const volume = Number((event.currentTarget as HTMLInputElement).value);
  sounds.bgm.volume = volume * 0.5;
  sounds.drop.volume = volume * 0.7;
  sounds.merge.volume = volume;
});

loadImages();
updateHud();
requestAnimationFrame(draw);
