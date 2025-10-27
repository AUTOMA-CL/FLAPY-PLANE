const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const optimizedDir = path.join(imagesDir, 'optimized');

// Crear directorio optimized si no existe
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

const imagesToOptimize = [
  {
    input: 'background.jpeg',
    outputBaseName: 'background',
    formats: ['webp', 'avif'],
    quality: { webp: 80, avif: 70 }
  },
  {
    input: 'FE_NUEVOLOGO(avion)_AZUL.png',
    outputBaseName: 'logo',
    formats: ['webp', 'avif'],
    quality: { webp: 85, avif: 75 }
  },
  {
    input: 'plane.png',
    outputBaseName: 'plane',
    formats: ['webp', 'avif'],
    quality: { webp: 90, avif: 80 }
  }
];

async function optimizeImages() {
  console.log('🚀 Iniciando optimización de imágenes...\n');

  for (const config of imagesToOptimize) {
    const inputPath = path.join(imagesDir, config.input);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Archivo no encontrado: ${config.input}`);
      continue;
    }

    // Obtener info de imagen original
    const originalStats = fs.statSync(inputPath);
    const originalSizeKB = (originalStats.size / 1024).toFixed(2);

    console.log(`📸 Procesando: ${config.input} (${originalSizeKB} KB)`);

    try {
      // Generar WebP
      if (config.formats.includes('webp')) {
        const webpOutput = path.join(optimizedDir, `${config.outputBaseName}.webp`);
        await sharp(inputPath)
          .webp({ quality: config.quality.webp })
          .toFile(webpOutput);

        const webpStats = fs.statSync(webpOutput);
        const webpSizeKB = (webpStats.size / 1024).toFixed(2);
        const webpReduction = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);

        console.log(`  ✅ WebP: ${webpSizeKB} KB (${webpReduction}% reducción)`);
      }

      // Generar AVIF
      if (config.formats.includes('avif')) {
        const avifOutput = path.join(optimizedDir, `${config.outputBaseName}.avif`);
        await sharp(inputPath)
          .avif({ quality: config.quality.avif })
          .toFile(avifOutput);

        const avifStats = fs.statSync(avifOutput);
        const avifSizeKB = (avifStats.size / 1024).toFixed(2);
        const avifReduction = ((1 - avifStats.size / originalStats.size) * 100).toFixed(1);

        console.log(`  ✅ AVIF: ${avifSizeKB} KB (${avifReduction}% reducción)`);
      }

      console.log('');
    } catch (error) {
      console.error(`  ❌ Error procesando ${config.input}:`, error.message);
    }
  }

  console.log('✨ Optimización completada!\n');
  console.log('📁 Imágenes optimizadas en: public/images/optimized/\n');
  console.log('🔍 Revisa las imágenes y compara calidad antes de continuar.');
}

optimizeImages().catch(console.error);
