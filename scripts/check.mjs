import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
const visions = JSON.parse(readFileSync(resolve(root, 'visions.json'), 'utf8'));
assert.equal(visions.length, 17, 'The board must contain all 17 visions');
assert.equal(new Set(visions.map(v => v.id)).size, 17, 'Vision IDs must be unique');
assert.match(html, /<html lang="sv">/);
const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1];
assert.ok(main, 'The page needs a main landmark');
assert.equal((main.match(/data-artwork=/g) || []).length, 17, 'Every vision must be in main');
assert.ok(!main.includes('<footer'), 'The site footer belongs outside main');
for (const vision of visions) {
  assert.ok(vision.title && vision.caption && vision.alt, `Missing text for ${vision.id}`);
  assert.equal((html.match(new RegExp(`data-artwork="${vision.id}"`, 'g')) || []).length, 1);
  for (const width of [480, 960, 1440]) {
    const path = resolve(root, `dist/assets/visions/${vision.id}-${width}.webp`);
    assert.ok(existsSync(path), `Missing artwork: ${path}`);
    assert.ok(statSync(path).size > 1000, `Empty artwork: ${path}`);
    const header = readFileSync(path).subarray(0, 12);
    assert.equal(header.subarray(0, 4).toString(), 'RIFF');
    assert.equal(header.subarray(8, 12).toString(), 'WEBP');
  }
}
for (const [, url] of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
  if (url.startsWith('data:') || url.startsWith('http')) continue;
  assert.ok(existsSync(resolve(root, 'dist', url)), `Broken local reference: ${url}`);
}
const firstScreenBytes = ['pisa', 'breakfast'].reduce((sum, id) => sum + statSync(resolve(root, `dist/assets/visions/${id}-960.webp`)).size, 0);
assert.ok(firstScreenBytes < 1_000_000, 'Opening artwork exceeds the 1 MB target');
console.log(`Passed: 17 visions, 51 valid WebP assets, local references, main landmark, opening art ${Math.round(firstScreenBytes / 1024)} KB.`);
