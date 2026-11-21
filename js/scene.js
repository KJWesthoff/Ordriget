import { clearFx } from './fx.js';
import { detachKeyboard } from './ui.js';

let current = null;
export function setScene(s) {
  if (current && current.exit) current.exit();
  detachKeyboard();
  clearFx();
  current = s;
  if (s.enter) s.enter();
}
export function getScene() { return current; }
