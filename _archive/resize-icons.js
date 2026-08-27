// Reason: One-off utility/temp file moved to archive during codebase cleanup.
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function resizeIcons() {
  const input = path.join(__dirname, 'assets', 'icon.png');
  const out192 = path.join(__dirname, 'public', 'icon-192.png');
  const out512 = path.join(__dirname, 'public', 'icon-512.png');

  if (!fs.existsSync(input)) {
    console.error('Missing input icon at', input);
    return;
  }

  await sharp(input).resize(192, 192).toFile(out192);
  await sharp(input).resize(512, 512).toFile(out512);

  console.log('Icons resized successfully!');
}

resizeIcons().catch(console.error);

