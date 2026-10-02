// The endless canvas: drag to pan, wheel or pinch to zoom, grab a widget's
// border to move it. Widgets are listed in widgets/list.js.

import names from './widgets/list.js';

const viewport = document.getElementById('viewport');
const world = document.getElementById('world');

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;

// Camera: screen = world * zoom + (x, y)
const cam = { x: innerWidth / 2, y: innerHeight / 2, zoom: 1 };

function applyCamera() {
  world.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.zoom})`;
  const grid = 28 * cam.zoom;
  viewport.style.backgroundSize = `${grid}px ${grid}px`;
  viewport.style.backgroundPosition = `${cam.x}px ${cam.y}px`;
}

function zoomAt(sx, sy, factor) {
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, cam.zoom * factor));
  const k = zoom / cam.zoom;
  cam.x = sx - (sx - cam.x) * k;
  cam.y = sy - (sy - cam.y) * k;
  cam.zoom = zoom;
  applyCamera();
}

// ---- Panning and pinch-zooming the canvas ----

const pointers = new Map();
let pinchDist = 0;

viewport.addEventListener('pointerdown', (e) => {
  if (e.target !== viewport && e.target !== world) return;
  viewport.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  viewport.classList.add('panning');
  if (pointers.size === 2) pinchDist = distance();
});

viewport.addEventListener('pointermove', (e) => {
  const p = pointers.get(e.pointerId);
  if (!p) return;
  if (pointers.size === 1) {
    cam.x += e.clientX - p.x;
    cam.y += e.clientY - p.y;
    applyCamera();
  }
  p.x = e.clientX;
  p.y = e.clientY;
  if (pointers.size === 2) {
    const d = distance();
    const [a, b] = [...pointers.values()];
    zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, d / pinchDist);
    pinchDist = d;
  }
});

function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size === 0) viewport.classList.remove('panning');
}
viewport.addEventListener('pointerup', endPointer);
viewport.addEventListener('pointercancel', endPointer);

function distance() {
  const [a, b] = [...pointers.values()];
  return Math.hypot(a.x - b.x, a.y - b.y) || 1;
}

viewport.addEventListener('wheel', (e) => {
  e.preventDefault();
  const mouseWheel = e.deltaMode !== 0 ||
    (e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 50);
  if (e.ctrlKey || mouseWheel) {
    // Mouse wheel or trackpad pinch: zoom
    zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
  } else {
    // Trackpad two-finger scroll: pan
    cam.x -= e.deltaX;
    cam.y -= e.deltaY;
    applyCamera();
  }
}, { passive: false });

// ---- Moving widgets by their border ----

let top = 1;

function makeMovable(card, pos) {
  let last = null;
  card.addEventListener('pointerdown', (e) => {
    card.style.zIndex = ++top;
    if (e.target !== card) return; // clicks inside belong to the widget
    e.stopPropagation();
    card.setPointerCapture(e.pointerId);
    card.classList.add('lifted');
    last = { x: e.clientX, y: e.clientY };
  });
  card.addEventListener('pointermove', (e) => {
    if (!last) return;
    pos.x += (e.clientX - last.x) / cam.zoom;
    pos.y += (e.clientY - last.y) / cam.zoom;
    last = { x: e.clientX, y: e.clientY };
    card.style.left = pos.x + 'px';
    card.style.top = pos.y + 'px';
  });
  const drop = () => { last = null; card.classList.remove('lifted'); };
  card.addEventListener('pointerup', drop);
  card.addEventListener('pointercancel', drop);
}

// ---- Scattering widgets like things in a drawer ----

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pick a spot that doesn't overlap anything placed so far. The spread grows
// with the number of widgets, so there is always some digging to do.
function findSpot(w, h, placed, spread) {
  const gap = 60;
  for (let tries = 0; tries < 400; tries++) {
    const r = spread * Math.sqrt(Math.random()) * (1 + tries / 200);
    const a = Math.random() * Math.PI * 2;
    const x = Math.cos(a) * r - w / 2;
    const y = Math.sin(a) * r - h / 2;
    const clear = placed.every((p) =>
      x + w + gap < p.x || p.x + p.w + gap < x ||
      y + h + gap < p.y || p.y + p.h + gap < y);
    if (clear) return { x, y };
  }
  return { x: (Math.random() - 0.5) * spread * 4, y: (Math.random() - 0.5) * spread * 4 };
}

async function load() {
  const placed = [];
  const spread = 350 + Math.sqrt(names.length) * 320;

  for (const name of shuffle([...names])) {
    let widget;
    try {
      widget = (await import(`./widgets/${name}.js`)).default;
    } catch (err) {
      console.warn(`Widget "${name}" failed to load:`, err);
      continue;
    }
    const w = widget.width ?? 200;
    const h = widget.height ?? 200;
    // The first one lands near the middle so there's always something in view.
    const pos = findSpot(w + 24, h + 24, placed, placed.length ? spread : 150);
    placed.push({ ...pos, w: w + 24, h: h + 24 });

    const card = document.createElement('div');
    card.className = 'card';
    card.style.left = pos.x + 'px';
    card.style.top = pos.y + 'px';
    card.style.width = w + 24 + 'px';
    card.style.height = h + 24 + 'px';
    card.style.rotate = (Math.random() - 0.5) * 6 + 'deg';

    const body = document.createElement('div');
    body.className = 'body';
    card.appendChild(body);
    world.appendChild(card);
    makeMovable(card, pos);

    try {
      widget.mount(body);
    } catch (err) {
      console.warn(`Widget "${name}" crashed:`, err);
      card.remove();
    }
  }
}

applyCamera();
load();
