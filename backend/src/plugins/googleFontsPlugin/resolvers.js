import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import System from '../../models/system.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url} - Status: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buffer);
}

export default {
  Query: {
    getGoogleFonts: async (_, __, { connection }) => {
      try {
        const res = await fetch('https://gwfh.mranftl.com/api/fonts');
        const fonts = await res.json();
        return JSON.stringify(fonts);
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        console.error('Error fetching Google Fonts:', err);
        throw new Error('Failed to fetch Google Fonts');
      }
    },
  },
  Mutation: {
    downloadGoogleFont: async (_, { font }, ctx) => {
      try {
        const fontData = JSON.parse(font);
        const fontId = fontData.id;

        const res = await fetch(`https://gwfh.mranftl.com/api/fonts/${fontId}?subsets=latin`);
        if (!res.ok) throw new Error('Failed to fetch font details');
        const fullFontData = await res.json();

        const basePath = path.resolve(
          __dirname,
          '../../../../',
          'frontend',
          'public',
          'googleFonts',
          fontId,
        );
        await fs.mkdir(basePath, { recursive: true });

        const variants = fullFontData.variants || [];
        for (const variant of variants) {
          if (!variant.woff2) continue;
          const url = variant.woff2;
          const variantName = variant.fontWeight || variant.style || variant.variant || 'regular'; // or get from your variant data
          const ext = path.extname(new URL(url).pathname);
          const fileName = `${fontId}-${variantName}${ext}`;
          const destPath = path.join(basePath, fileName);

          await downloadFile(url, destPath);
        }

        return { success: true };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        console.error('Error downloading font:', err);
        return { success: false, message: err.message };
      }
    },
  },
};
