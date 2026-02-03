import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function generateCard() {
  console.log('Generating trading card OG image...');

  const svgPath = join(publicDir, 'og-card.svg');
  const svgContent = readFileSync(svgPath, 'utf-8');

  // Convert to PNG
  await sharp(Buffer.from(svgContent))
    .resize(1200, 630)
    .png()
    .toFile(join(publicDir, 'og-image.png'));

  console.log('Generated: public/og-image.png');
}

generateCard().catch(console.error);
