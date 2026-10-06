import fs from 'fs';
import path from 'path';

// Master SVG Path definitions for the LearnDean LD Monogram
// Unifies 'L' and 'D' seamlessly into a modern, geometric mark with uniform 18px stroke weight,
// rounded caps, 5px precision channel at the top, and unified continuous bottom foundation.
const LD_MONOGRAM_PATH = 
  "M 26 28 C 26 24.686 28.686 22 32 22 L 38 22 C 41.314 22 44 24.686 44 28 L 44 78 L 62 78 C 72.493 78 81 69.941 81 60 C 81 50.059 72.493 42 62 42 L 53 42 C 50.791 42 49 40.209 49 38 L 49 28 C 49 25.791 50.791 24 53 24 L 62 24 C 81.882 24 98 40.118 98 60 C 98 79.882 81.882 96 62 96 L 32 96 C 28.686 96 26 93.314 26 90 Z";

// 4-pointed AI Intelligence Core Spark
const LD_SPARK_PATH = 
  "M 62.5 51 Q 62.5 60 71.5 60 Q 62.5 60 62.5 69 Q 62.5 60 53.5 60 Q 62.5 60 62.5 51 Z";

function createEmblemSvg(bgType, size = 120) {
  let bgElement = '';
  let monogramFill = 'url(#ld-brand-grad)';
  let sparkFill = '#0284C7';

  if (bgType === 'primary') {
    bgElement = `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.233)}" fill="#FFFFFF"/>`;
    monogramFill = 'url(#ld-brand-grad)';
    sparkFill = '#0284C7';
  } else if (bgType === 'dark') {
    bgElement = `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.233)}" fill="#071A3D"/>`;
    monogramFill = 'url(#ld-white-grad)';
    sparkFill = '#38BDF8';
  } else if (bgType === 'app-icon') {
    bgElement = `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.233)}" fill="url(#ld-app-bg)"/>`;
    monogramFill = '#FFFFFF';
    sparkFill = '#38BDF8';
  } else if (bgType === 'light-blue') {
    bgElement = `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.233)}" fill="#EAF4FF"/>`;
    monogramFill = 'url(#ld-brand-grad)';
    sparkFill = '#0284C7';
  } else {
    // transparent
    bgElement = '';
    monogramFill = 'url(#ld-brand-grad)';
    sparkFill = '#0284C7';
  }

  const scale = size / 120;
  const content = scale === 1 ? `
  <path d="${LD_MONOGRAM_PATH}" fill="${monogramFill}"/>
  <path d="${LD_SPARK_PATH}" fill="${sparkFill}"/>` : `
  <g transform="scale(${scale})">
    <path d="${LD_MONOGRAM_PATH}" fill="${monogramFill}"/>
    <path d="${LD_SPARK_PATH}" fill="${sparkFill}"/>
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <!-- Premium Deep Navy to Electric Blue with subtle purple accent -->
    <linearGradient id="ld-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071A3D"/>
      <stop offset="35%" stop-color="#0B3C8A"/>
      <stop offset="70%" stop-color="#1769E0"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>

    <!-- White-to-Ice gradient for dark mode -->
    <linearGradient id="ld-white-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#EAF4FF"/>
    </linearGradient>

    <!-- App Icon Deep Blue Gradient Background: #071A3D -> #1769E0 -->
    <linearGradient id="ld-app-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071A3D"/>
      <stop offset="55%" stop-color="#0D47A1"/>
      <stop offset="100%" stop-color="#1769E0"/>
    </linearGradient>

    <!-- AI Spark Accent Gradient -->
    <linearGradient id="ld-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
  </defs>
  ${bgElement}${content}
</svg>`;
}

function createWordmarkSvg(bgType) {
  let bgElement = '';
  let textColor = '#0F172A';
  let blueColor = '#1769E0';
  let subColor = '#64748B';
  let badgeBg = '#DBEAFE';
  let badgeText = '#1D4ED8';
  let iconBg = 'app-icon';

  if (bgType === 'primary') {
    bgElement = '<rect width="320" height="80" rx="16" fill="#FFFFFF"/>';
    textColor = '#071A3D';
    blueColor = '#1769E0';
    subColor = '#64748B';
    badgeBg = '#DBEAFE';
    badgeText = '#1D4ED8';
    iconBg = 'primary';
  } else if (bgType === 'dark') {
    bgElement = '<rect width="320" height="80" rx="16" fill="#071A3D"/>';
    textColor = '#FFFFFF';
    blueColor = '#38BDF8';
    subColor = '#94A3B8';
    badgeBg = '#1E293B';
    badgeText = '#38BDF8';
    iconBg = 'dark';
  } else if (bgType === 'app-icon') {
    bgElement = '<rect width="320" height="80" rx="16" fill="url(#ld-app-bg)"/>';
    textColor = '#FFFFFF';
    blueColor = '#7DD3FC';
    subColor = '#E0F2FE';
    badgeBg = 'rgba(255,255,255,0.2)';
    badgeText = '#FFFFFF';
    iconBg = 'app-icon';
  } else if (bgType === 'light-blue') {
    bgElement = '<rect width="320" height="80" rx="16" fill="#EAF4FF"/>';
    textColor = '#071A3D';
    blueColor = '#1769E0';
    subColor = '#475569';
    badgeBg = '#BFDBFE';
    badgeText = '#1E40AF';
    iconBg = 'light-blue';
  } else {
    // transparent
    bgElement = '';
    textColor = '#071A3D';
    blueColor = '#1769E0';
    subColor = '#64748B';
    badgeBg = '#DBEAFE';
    badgeText = '#1D4ED8';
    iconBg = 'app-icon';
  }

  const isWhiteIcon = iconBg === 'dark' || iconBg === 'app-icon';
  const iconRect = iconBg === 'app-icon'
    ? '<rect width="56" height="56" rx="14" fill="url(#ld-app-bg)"/>'
    : iconBg === 'dark'
    ? '<rect width="56" height="56" rx="14" fill="#0B1E40"/>'
    : iconBg === 'primary'
    ? '<rect width="56" height="56" rx="14" fill="#F8FAFC" stroke="#E2E8F0"/>'
    : '<rect width="56" height="56" rx="14" fill="#EAF4FF"/>';

  const emblemFill = isWhiteIcon ? '#FFFFFF' : 'url(#ld-brand-grad)';
  const sparkFill = isWhiteIcon ? '#38BDF8' : '#0284C7';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
  <defs>
    <linearGradient id="ld-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071A3D"/>
      <stop offset="35%" stop-color="#0B3C8A"/>
      <stop offset="70%" stop-color="#1769E0"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
    <linearGradient id="ld-app-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071A3D"/>
      <stop offset="55%" stop-color="#0D47A1"/>
      <stop offset="100%" stop-color="#1769E0"/>
    </linearGradient>
  </defs>

  ${bgElement}

  <!-- App Icon Monogram Symbol at (12, 12) -->
  <g transform="translate(12, 12)">
    ${iconRect}
    <g transform="scale(0.466)">
      <path d="${LD_MONOGRAM_PATH}" fill="${emblemFill}"/>
      <path d="${LD_SPARK_PATH}" fill="${sparkFill}"/>
    </g>
  </g>

  <!-- LearnDean Typography -->
  <text x="80" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="26" letter-spacing="-0.5">
    <tspan fill="${textColor}">Learn</tspan><tspan fill="${blueColor}">Dean</tspan>
  </text>

  <!-- PRO Badge -->
  <rect x="238" y="27" width="38" height="18" rx="4" fill="${badgeBg}"/>
  <text x="257" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="10" fill="${badgeText}" text-anchor="middle" letter-spacing="0.5">PRO</text>

  <!-- Subtitle -->
  <text x="80" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="11" fill="${subColor}" letter-spacing="0.2">
    AI Learning System
  </text>
</svg>`;
}

const publicDir = path.resolve('public');

// 1. Generate Emblem SVGs for all background variants
const emblemVariants = [
  { name: 'logo-primary.svg', bg: 'primary', size: 120 },
  { name: 'logo-dark.svg', bg: 'dark', size: 120 },
  { name: 'logo-app-icon.svg', bg: 'app-icon', size: 120 },
  { name: 'logo-transparent.svg', bg: 'transparent', size: 120 },
  { name: 'logo-light-blue.svg', bg: 'light-blue', size: 120 },
  { name: 'logo.svg', bg: 'app-icon', size: 120 },
  { name: 'logo-brand.svg', bg: 'primary', size: 120 },
  { name: 'pwa-192x192.svg', bg: 'app-icon', size: 192 },
  { name: 'pwa-512x512.svg', bg: 'app-icon', size: 512 }
];

emblemVariants.forEach(({ name, bg, size }) => {
  const filePath = path.join(publicDir, name);
  fs.writeFileSync(filePath, createEmblemSvg(bg, size));
  console.log(`Generated: ${name} (${size}x${size}, bg: ${bg})`);
});

// 2. Generate Wordmark SVGs for all background variants
const wordmarkVariants = [
  { name: 'wordmark-primary.svg', bg: 'primary' },
  { name: 'wordmark-dark.svg', bg: 'dark' },
  { name: 'wordmark-app-icon.svg', bg: 'app-icon' },
  { name: 'wordmark-transparent.svg', bg: 'transparent' },
  { name: 'wordmark-light-blue.svg', bg: 'light-blue' }
];

wordmarkVariants.forEach(({ name, bg }) => {
  const filePath = path.join(publicDir, name);
  fs.writeFileSync(filePath, createWordmarkSvg(bg));
  console.log(`Generated: ${name} (bg: ${bg})`);
});

console.log('All brand logo and wordmark assets successfully generated!');
