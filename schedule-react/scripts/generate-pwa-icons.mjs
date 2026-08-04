// icon.svg → PWA용 PNG (180/192/512) 생성
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const svg = readFileSync(join(publicDir, 'icon.svg'));

/** maskable — Android 안전 영역 여백 */
async function writeMaskable512() {
  const inner = 512 * 0.8;
  const padding = (512 - inner) / 2;
  const resized = await sharp(svg).resize(Math.round(inner), Math.round(inner)).png().toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 10, g: 10, b: 10, alpha: 1 },
    },
  })
    .composite([{ input: resized, left: Math.round(padding), top: Math.round(padding) }])
    .png()
    .toFile(join(publicDir, 'icon-maskable-512.png'));
}

const outputs = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
];

for (const { file, size } of outputs) {
  await sharp(svg).resize(size, size).png().toFile(join(publicDir, file));
  console.log(`created ${file}`);
}

await writeMaskable512();
console.log('created icon-maskable-512.png');
