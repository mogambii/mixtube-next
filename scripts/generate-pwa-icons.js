// Generate PWA icons from public/icon.png using sharp
// Usage: node scripts/generate-pwa-icons.js

const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function generateIcon(inputPath, outputPath, size) {
  await sharp(inputPath)
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function main() {
  const projectRoot = path.join(__dirname, "..");
  const input = path.join(projectRoot, "public", "icon.png");
  const outDir = path.join(projectRoot, "public", "icons");

  await ensureDir(outDir);

  await Promise.all([
    generateIcon(input, path.join(outDir, "icon-192.png"), 192),
    generateIcon(input, path.join(outDir, "icon-512.png"), 512),
  ]);

  console.log("PWA icons generated in public/icons");
}

main().catch((err) => {
  console.error("Icon generation failed:", err);
  process.exit(1);
});


