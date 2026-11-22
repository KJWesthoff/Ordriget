// Animationer: tweens, flydende tal, partikler og rystelser.
import { text } from './gfx.js';

const tweens = [];
const floats = [];
const parts = [];
export const camera = { shake: 0, x: 0, y: 0 };

export function tween(ms, fn) {
  return new Promise(resolve => tweens.push({ t: 0, ms, fn, resolve }));
}
export const wait = ms => tween(ms, () => {});
export const ease = p => 1 - Math.pow(1 - p, 3);

export function floatText(str, x, y, color = '#fcfcfc', size = 10) {
  floats.push({ str, x, y, color, size, t: 0 });
}
export function burst(x, y, color, n = 14, speed = 60, grav = 80) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = speed * (0.4 + Math.random() * 0.8);
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 20, life: 0.6 + Math.random() * 0.4, t: 0, color, grav, size: Math.random() < 0.3 ? 2 : 1 });
  }
}
export function rise(x, y, w, color, n = 16) {
  for (let i = 0; i < n; i++) parts.push({ x: x + Math.random() * w, y: y + Math.random() * 20, vx: 0, vy: -20 - Math.random() * 30, life: 0.9, t: Math.random() * -0.4, color, grav: 0, size: 2 });
}
export function shake(px = 4) { camera.shake = Math.max(camera.shake, px); }

export function update(dt) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i];
    tw.t += dt * 1000;
    const p = Math.min(1, tw.t / tw.ms);
    tw.fn(p);
    if (p >= 1) { tweens.splice(i, 1); tw.resolve(); }
  }
  for (let i = floats.length - 1; i >= 0; i--) { floats[i].t += dt; if (floats[i].t > 1.1) floats.splice(i, 1); }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.t += dt;
    if (p.t < 0) continue;
    p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.t > p.life) parts.splice(i, 1);
  }
  if (camera.shake > 0) {
    camera.x = Math.round((Math.random() - 0.5) * camera.shake * 2);
    camera.y = Math.round((Math.random() - 0.5) * camera.shake * 2);
    camera.shake = Math.max(0, camera.shake - dt * 20);
  } else { camera.x = camera.y = 0; }
}

export function draw(ctx) {
  for (const p of parts) {
    if (p.t < 0) continue;
    ctx.globalAlpha = Math.max(0, 1 - p.t / p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    // lille glorie om hver gnist
    ctx.globalAlpha *= 0.25;
    ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, p.size + 2, p.size + 2);
  }
  ctx.globalAlpha = 1;
  for (const f of floats) {
    const y = f.y - ease(Math.min(1, f.t / 0.8)) * 22;
    ctx.globalAlpha = f.t > 0.8 ? Math.max(0, 1 - (f.t - 0.8) / 0.3) : 1;
    text(ctx, f.str, Math.round(f.x), Math.round(y), { size: f.size, color: f.color, align: 'center' });
  }
  ctx.globalAlpha = 1;
}

export function clearFx() { floats.length = 0; parts.length = 0; }
