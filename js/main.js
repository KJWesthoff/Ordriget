import { W, H, SCALE } from './gfx.js';
import * as fx from './fx.js';
import { getScene } from './scene.js';
import { initAudio, unlockSpeech, setAudioPrefs, setRate } from './audio.js';
import { load, save } from './state.js';
import { onMenu } from './ui.js';
import { toTitle, openMenu } from './flow.js';

const canvas = document.getElementById('scene');
canvas.width = W * SCALE; canvas.height = H * SCALE;
const ctx = canvas.getContext('2d');

let last = performance.now(), time = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now; time += dt;
  fx.update(dt);
  const s = getScene();
  if (s && s.update) s.update(dt, time);
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.translate(fx.camera.x, fx.camera.y);
  if (s && s.draw) s.draw(ctx, time);
  fx.draw(ctx);
  ctx.restore();
  requestAnimationFrame(frame);
}

canvas.addEventListener('pointerdown', e => {
  const r = canvas.getBoundingClientRect();
  // canvas bruger object-fit: contain
  const sc = Math.min(r.width / W, r.height / H);
  const ox = (r.width - W * sc) / 2, oy = (r.height - H * sc) / 2;
  const x = (e.clientX - r.left - ox) / sc, y = (e.clientY - r.top - oy) / sc;
  const s = getScene();
  if (s && s.click && x >= 0 && y >= 0 && x < W && y < H) s.click(x, y);
});

// iOS kræver et tryk før lyd og tale må starte
let unlocked = false;
window.addEventListener('pointerdown', () => {
  initAudio();
  if (!unlocked) { unlocked = true; unlockSpeech(); }
}, { capture: true });

// Forhindr dobbelttryk-zoom på iPhone
let lastTouch = 0;
document.addEventListener('touchend', e => {
  const n = Date.now();
  if (n - lastTouch < 350 && !e.target.closest('textarea,input')) e.preventDefault();
  lastTouch = n;
}, { passive: false });

if (load()) {
  setAudioPrefs({ music: save.settings.music, sfx: save.settings.sfx });
  setRate(save.settings.rate);
}
onMenu(openMenu);

const start = () => { toTitle(); requestAnimationFrame(frame); };
if (document.fonts && document.fonts.load) {
  Promise.race([
    Promise.all([document.fonts.load("8px 'Press Start 2P'"), document.fonts.load("20px 'VT323'")]),
    new Promise(r => setTimeout(r, 1500)),
  ]).then(start, start);
} else start();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
