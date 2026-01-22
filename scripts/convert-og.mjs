import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svgPath = join(publicDir, 'og-image.svg');
const pngPath = join(publicDir, 'og-image.png');

const svgBuffer = readFileSync(svgPath);

sharp(svgBuffer, { density: 150 })
  .resize(1200, 630)
  .png()
  .toFile(pngPath)
  .then(() => console.log('Created og-image.png'))
  .catch(err => console.error('Error:', err));
