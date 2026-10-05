import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import jsQR from 'jsqr';
import pngjs from 'pngjs';
import { parseQR } from './qrParser.ts';

const { PNG } = pngjs;
const samples = [
  ['john.png', 'john@example.com'],
  ['coffee-static.png', 'payments@coffee.ca'],
  ['coffee-prefilled.png', 'payments@coffee.ca'],
  ['sarah.png', 'sarah@example.com'],
];

async function decodeSample(filename) {
  const buffer = await readFile(new URL(`../../../public/samples/${filename}`, import.meta.url));
  const { data, width, height } = PNG.sync.read(buffer);
  return jsQR(new Uint8ClampedArray(data), width, height)?.data;
}

describe('bundled sample QR images', () => {
  for (const [filename, recipient] of samples) {
    it(`decodes ${filename} from pixels`, async () => {
      const raw = await decodeSample(filename);
      expect(raw).toBeTruthy();
      expect(parseQR(raw).to).toBe(recipient);
    });
  }

  it('decodes the unsupported sample, then rejects its payment schema', async () => {
    const raw = await decodeSample('unsupported-website.png');
    expect(raw).toBe('https://example.com');
    expect(() => parseQR(raw)).toThrow('This is not a supported IntQRac payment QR.');
  });
});
