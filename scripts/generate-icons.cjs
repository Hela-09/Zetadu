const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.resolve(__dirname, '../public');

// 1. Prepare SVG for Maskable Icon (Full bleed background without rounded corners, bird centered inside 78% safe-zone)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bird-bg-m" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#051636"/>
      <stop offset="40%" stop-color="#0A367E"/>
      <stop offset="80%" stop-color="#1463D5"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="bird-wing-dark-m" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="35%" stop-color="#BAE6FD"/>
      <stop offset="75%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="bird-inner-dark-m" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#7DD3FC"/>
    </linearGradient>
    <linearGradient id="bird-head-dark-m" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#BAE6FD"/>
    </linearGradient>
    <linearGradient id="bird-gold-m" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="book-pages-dark-m" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="85%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="bird-shadow-m" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#020817" flood-opacity="0.32"/>
    </filter>
  </defs>

  <!-- Full-bleed background for maskable (Android clips this into shapes) -->
  <rect width="120" height="120" fill="url(#bird-bg-m)"/>

  <!-- Centered, scaled content within 78% circular safe zone -->
  <g transform="translate(13.2, 13.2) scale(0.78)" filter="url(#bird-shadow-m)">
    <!-- Tail Feathers -->
    <path d="M 56 61 L 52 71 L 57 69 L 60 74 L 63 69 L 68 71 L 64 61 Z" fill="url(#bird-inner-dark-m)"/>
    <!-- Left Wing -->
    <path d="M 52 46 C 46 36 34 24 13 18 C 12 23 17 29 23 34 C 25 35 27 35 28 34 C 23 39 23 45 28 49 C 30 50 32 50 33 49 C 29 53 31 59 38 61 C 44 62 48 55 52 46 Z" fill="url(#bird-wing-dark-m)"/>
    <path d="M 50 46 C 42 36 32 30 22 25 C 27 30 33 37 42 43 C 46 45 49 46 50 46 Z" fill="url(#bird-inner-dark-m)" opacity="0.85"/>
    <!-- Right Wing -->
    <path d="M 68 46 C 74 36 86 24 107 18 C 108 23 103 29 97 34 C 95 35 93 35 92 34 C 97 39 97 45 92 49 C 90 50 88 50 87 49 C 91 53 89 59 82 61 C 76 62 72 55 68 46 Z" fill="url(#bird-wing-dark-m)"/>
    <path d="M 70 46 C 78 36 88 30 98 25 C 93 30 87 37 78 43 C 74 45 71 46 70 46 Z" fill="url(#bird-inner-dark-m)" opacity="0.85"/>
    <!-- Bird Head & Torso -->
    <path d="M 56 46 C 55 40 56 32 57 28 C 57.5 24 58.5 20 60 16 L 60 12 L 62 18 C 63.5 22 64 30 64 46 C 64 54 62 60 60 63 C 58 60 56 54 56 46 Z" fill="url(#bird-head-dark-m)"/>
    <circle cx="58.5" cy="22" r="1.3" fill="url(#bird-gold-m)"/>
    <!-- Open Book Underpage / Binding Layer -->
    <path d="M 26 84 C 42 80 52 82 60 87 C 68 82 78 80 94 84 L 94 87 C 78 83 68 85 60 90 C 52 85 42 83 26 87 Z" fill="#0F172A" opacity="0.9"/>
    <!-- Open Book Left Page Spread -->
    <path d="M 60 70 C 52 66 40 66 26 70 C 25 71 25 82 26 84 C 42 80 52 82 60 87 Z" fill="url(#book-pages-dark-m)" stroke="#E2E8F0" stroke-width="0.8"/>
    <!-- Open Book Right Page Spread -->
    <path d="M 60 70 C 68 66 80 66 94 70 C 95 71 95 82 94 84 C 78 80 68 82 60 87 Z" fill="url(#book-pages-dark-m)" stroke="#E2E8F0" stroke-width="0.8"/>
    <!-- Book Page Wisdom Scripts -->
    <path d="M 33 74 C 41 71 48 72 54 74.5" stroke="#94A3B8" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M 34 78 C 41 75 48 76 54 78.5" stroke="#94A3B8" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M 66 74.5 C 72 72 79 71 87 74" stroke="#94A3B8" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M 66 78.5 C 72 76 79 75 86 78" stroke="#94A3B8" stroke-width="1.2" stroke-linecap="round"/>
    <!-- Bird Talons Grasping Book Top Rim -->
    <path d="M 52 64 C 51 67 52 70 55 70 C 56 70 56 67 55 64 Z" fill="url(#bird-gold-m)"/>
    <path d="M 68 64 C 69 67 68 70 65 70 C 64 70 64 67 65 64 Z" fill="url(#bird-gold-m)"/>
    <!-- Golden Bookmark Ribbon Hanging from Book Spine -->
    <path d="M 58.5 87 L 58.5 97 L 60 95 L 61.5 97 L 61.5 87 Z" fill="url(#bird-gold-m)"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'logo-maskable.svg'), maskableSvg);

// Standalone icon (purpose: "any", rounded squircle for web / desktop / iOS)
const appIconSvgPath = path.join(PUBLIC_DIR, 'logo-app-icon.svg');
const appIconSvg = fs.readFileSync(appIconSvgPath);

async function generateAll() {
  console.log('Generating high-resolution PWA & app icons...');

  // 1. Standard "any" PWA icons
  await sharp(appIconSvg).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'pwa-512x512.png'));
  await sharp(appIconSvg).resize(192, 192).png().toFile(path.join(PUBLIC_DIR, 'pwa-192x192.png'));
  await sharp(appIconSvg).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'logo.png'));
  await sharp(appIconSvg).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'learndean_logo.png'));
  await sharp(appIconSvg).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'logo-512.png'));
  await sharp(appIconSvg).resize(192, 192).png().toFile(path.join(PUBLIC_DIR, 'logo-192.png'));

  // 2. Maskable PWA icons (Android adaptive icon safe zone)
  const maskableSvgBuffer = Buffer.from(maskableSvg);
  await sharp(maskableSvgBuffer).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, 'pwa-maskable-512x512.png'));
  await sharp(maskableSvgBuffer).resize(192, 192).png().toFile(path.join(PUBLIC_DIR, 'pwa-maskable-192x192.png'));

  // 3. Apple Touch Icons for iOS home screen
  await sharp(appIconSvg).resize(180, 180).png().toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  await sharp(appIconSvg).resize(180, 180).png().toFile(path.join(PUBLIC_DIR, 'apple-touch-icon-180x180.png'));
  await sharp(appIconSvg).resize(152, 152).png().toFile(path.join(PUBLIC_DIR, 'apple-touch-icon-152x152.png'));
  await sharp(appIconSvg).resize(120, 120).png().toFile(path.join(PUBLIC_DIR, 'apple-touch-icon-120x120.png'));

  // 4. Browser favicons
  await sharp(appIconSvg).resize(48, 48).png().toFile(path.join(PUBLIC_DIR, 'favicon-48x48.png'));
  await sharp(appIconSvg).resize(32, 32).png().toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  await sharp(appIconSvg).resize(16, 16).png().toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));

  // 5. Generate genuine multi-layer ICO for desktop browser tabs (16x16, 32x32, 48x48)
  // Simple ICO builder using PNG chunks:
  const png16 = await sharp(appIconSvg).resize(16, 16).png().toBuffer();
  const png32 = await sharp(appIconSvg).resize(32, 32).png().toBuffer();
  const png48 = await sharp(appIconSvg).resize(48, 48).png().toBuffer();

  const icoBuffer = buildIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 }
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);

  // 6. Favicon SVG & logo SVGs
  fs.copyFileSync(appIconSvgPath, path.join(PUBLIC_DIR, 'favicon.svg'));

  console.log('Successfully generated all icons!');
}

function buildIco(images) {
  // ICO header: 6 bytes
  // 0-1: Reserved (0)
  // 2-3: Type (1 = ICO)
  // 4-5: Count of images
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let currentOffset = 6 + (images.length * 16);
  const dirEntries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette (0 = no palette)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Size of image data
    entry.writeUInt32LE(currentOffset, 12); // Offset to image data

    dirEntries.push(entry);
    imageBuffers.push(img.buffer);
    currentOffset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

generateAll().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
