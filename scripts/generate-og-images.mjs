import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'og');

const TIERS = {
  SMART_MONEY: {
    name: 'SMART MONEY',
    color: '#00FFA7',
    description: "You don't follow alpha. You ARE the alpha. Wallets are tracking YOU, ser.",
    position: 90,
  },
  WHALE_ADJACENT: {
    name: 'WHALE ADJACENT',
    color: '#00FFA7',
    description: "You swim with whales but you're not one yet. 73% win rate is KOL territory.",
    position: 78,
  },
  DEGEN: {
    name: 'DEGEN',
    color: '#fbbf24',
    description: "50/50 win rate but 100% degen energy. You've aped more rugs than most have trades.",
    position: 45,
  },
  TOURIST: {
    name: 'TOURIST',
    color: '#f97316',
    description: "You buy after the CoinDesk article drops. Your portfolio is a museum of local tops.",
    position: 50,
  },
  EXIT_LIQUIDITY: {
    name: 'EXIT LIQUIDITY',
    color: '#ef4444',
    description: "VCs love you. KOLs love you. You're their exit.",
    position: 55,
  },
  NGMI: {
    name: 'NGMI',
    color: '#ef4444',
    description: "Ser, you bought LUNA at $80, aped SafeMoon, and your best trade was selling early.",
    position: 10,
  },
};

function generateSVG(tier, data) {
  const youX = 50 + (data.position / 100) * 400;
  // Calculate Y position on the bell curve
  const normalizedX = (data.position - 50) / 50; // -1 to 1
  const youY = 380 - (Math.exp(-normalizedX * normalizedX * 3) * 200);

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00FFA7"/>
      <stop offset="25%" stop-color="#a3e635"/>
      <stop offset="40%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="55%" stop-color="#ef4444"/>
      <stop offset="60%" stop-color="#f97316"/>
      <stop offset="75%" stop-color="#fbbf24"/>
      <stop offset="85%" stop-color="#a3e635"/>
      <stop offset="100%" stop-color="#00FFA7"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#0a0a0a"/>

  <!-- Tier Badge -->
  <rect x="${600 - (data.name.length * 12)}" y="40" width="${data.name.length * 24 + 40}" height="50" rx="25" fill="${data.color}"/>
  <text x="600" y="75" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#0a0a0a">${data.name}</text>

  <!-- Description -->
  <text x="600" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="white">${data.description.slice(0, 60)}</text>
  <text x="600" y="175" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="white">${data.description.slice(60)}</text>

  <!-- YOU marker -->
  <rect x="${youX * 1.1 + 100}" y="${youY - 70}" width="70" height="36" rx="18" fill="${data.color}"/>
  <text x="${youX * 1.1 + 135}" y="${youY - 45}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0a0a0a">YOU</text>
  <polygon points="${youX * 1.1 + 135},${youY - 34} ${youX * 1.1 + 125},${youY - 20} ${youX * 1.1 + 145},${youY - 20}" fill="${data.color}"/>

  <!-- Bell Curve -->
  <path d="M 100 520 C 150 520, 200 515, 280 490 C 380 450, 480 350, 550 280 C 600 230, 620 200, 650 200 C 680 200, 700 230, 750 280 C 820 350, 920 450, 1020 490 C 1100 515, 1050 520, 1100 520"
        fill="none" stroke="url(#curveGradient)" stroke-width="5"/>

  <!-- Curve fill -->
  <path d="M 100 520 C 150 520, 200 515, 280 490 C 380 450, 480 350, 550 280 C 600 230, 620 200, 650 200 C 680 200, 700 230, 750 280 C 820 350, 920 450, 1020 490 C 1100 515, 1050 520, 1100 520 L 1100 540 L 100 540 Z"
        fill="url(#curveGradient)" opacity="0.2"/>

  <!-- Emojis as text (will be rendered by sharp) -->
  <text x="180" y="480" text-anchor="middle" font-size="50">💀</text>
  <text x="650" y="320" text-anchor="middle" font-size="45">😌</text>
  <text x="1020" y="480" text-anchor="middle" font-size="50">🤓</text>

  <!-- Labels -->
  <text x="180" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#666">NGMI</text>
  <text x="650" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#666">Avg</text>
  <text x="1020" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#666">Smart Money</text>

  <!-- Bottom accent -->
  <rect x="0" y="625" width="1200" height="5" fill="#00FFA7"/>
</svg>`;
}

async function generateImages() {
  const { mkdirSync } = await import('fs');

  try {
    mkdirSync(join(__dirname, '..', 'public', 'og'), { recursive: true });
  } catch (e) {}

  for (const [tier, data] of Object.entries(TIERS)) {
    const svg = generateSVG(tier, data);
    const svgPath = join(publicDir, `${tier.toLowerCase()}.svg`);
    const pngPath = join(publicDir, `${tier.toLowerCase()}.png`);

    writeFileSync(svgPath, svg);

    await sharp(Buffer.from(svg), { density: 150 })
      .resize(1200, 630)
      .png()
      .toFile(pngPath);

    console.log(`Created ${tier.toLowerCase()}.png`);
  }

  console.log('All OG images generated!');
}

generateImages();
