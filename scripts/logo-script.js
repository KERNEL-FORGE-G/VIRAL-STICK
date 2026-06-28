const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Source logo
const SOURCE_LOGO_PATH = path.join(__dirname, '../asset/logo/logo_sans_fond.png');

// Target directories
const TARGETS = [
  path.join(__dirname, '../web/public/asset/logo'),
  path.join(__dirname, '../mobile/assets/logo'),
];

const ANDROID_ICON_SIZES = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const ANDROID_ICON_FOREGROUND_SIZES = {
  mdpi: 108,
  hdpi: 162,
  xhdpi: 216,
  xxhdpi: 324,
  xxxhdpi: 432,
};

console.log('🚀 Viral Stick Logo Compiler!');
console.log('============================');

// Copy logo files to all target directories
TARGETS.forEach(targetDir => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copy both logo versions
  ['logo.png', 'logo_sans_fond.png'].forEach(fileName => {
    const src = path.join(__dirname, '../asset/logo', fileName);
    const dest = path.join(targetDir, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied ${fileName} to ${targetDir}`);
    } else {
      console.warn(`⚠️ Source ${fileName} not found, skipping`);
    }
  });
});

// Process Android icons
console.log('\n📱 Processing Android native icons...');

const ANDROID_RES_DIRS = [
  path.join(__dirname, '../mobile/android/app/src/main/res'),
  path.join(__dirname, '../mobile/android-icon-resources'),
];

async function generateAndroidIcons() {
  for (const baseResDir of ANDROID_RES_DIRS) {
    for (const [density, size] of Object.entries(ANDROID_ICON_SIZES)) {
      const mipmapDir = path.join(baseResDir, `mipmap-${density}`);
      if (!fs.existsSync(mipmapDir)) {
        fs.mkdirSync(mipmapDir, { recursive: true });
      }
      
      // Generate ic_launcher.png and ic_launcher_round.png
      const iconPath = path.join(mipmapDir, 'ic_launcher.png');
      const iconRoundPath = path.join(mipmapDir, 'ic_launcher_round.png');
      
      await sharp(SOURCE_LOGO_PATH)
        .resize(size, size)
        .png()
        .toFile(iconPath);
      console.log(`✅ Generated ic_launcher.png for ${density} in ${baseResDir}`);
      
      await sharp(SOURCE_LOGO_PATH)
        .resize(size, size)
        .png()
        .toFile(iconRoundPath);
      console.log(`✅ Generated ic_launcher_round.png for ${density} in ${baseResDir}`);

      // Generate ic_launcher_foreground.png
      const fgSize = ANDROID_ICON_FOREGROUND_SIZES[density];
      const fgPath = path.join(mipmapDir, 'ic_launcher_foreground.png');
      
      await sharp(SOURCE_LOGO_PATH)
        .resize(fgSize, fgSize)
        .png()
        .toFile(fgPath);
      console.log(`✅ Generated ic_launcher_foreground.png for ${density} in ${baseResDir}`);
    }
  }
  
  // Generate Play Store icon (512x512)
  const playstoreIconDir = path.join(__dirname, '../mobile/android-icon-resources/playstore-icon');
  if (!fs.existsSync(playstoreIconDir)) {
    fs.mkdirSync(playstoreIconDir, { recursive: true });
  }
  
  await sharp(SOURCE_LOGO_PATH)
    .resize(512, 512)
    .png()
    .toFile(path.join(playstoreIconDir, 'ic_launcher.png'));
  console.log('\n✅ Generated Play Store icon (512x512)');
}

generateAndroidIcons().then(() => {
  console.log('\n✅ All logos and Android icons processed successfully!');
}).catch(err => {
  console.error('❌ Error generating Android icons:', err);
  process.exit(1);
});
