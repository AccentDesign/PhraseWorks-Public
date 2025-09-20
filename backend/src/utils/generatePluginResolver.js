import fs from 'fs';
import path from 'path';

const pluginsDir = path.resolve('./src/plugins');
const outputFile = path.resolve('./src/generated/pluginResolvers.js');

const outputFileJSON = path.resolve('../frontend/public/plugins.json');

function getPluginFolders(dir) {
  return fs.readdirSync(dir).filter((file) => {
    const fullPath = path.join(dir, file);
    return fs.statSync(fullPath).isDirectory();
  });
}

async function generateImportsAndExports(pluginFolders) {
  let imports = '';
  let resolversArray = 'const pluginResolvers = [\n';
  let typeDefsArray = 'const pluginTypeDefs = [\n';
  let metaArray = 'const pluginMeta = [\n';
  const pluginJsonArray = [];

  let index = 0;

  for (const folder of pluginFolders) {
    const importName = `plugin${index + 1}`;
    const importPath = `../plugins/${folder}/index.js`;

    // Read index.js content for this plugin
    const pluginIndexPath = path.join(pluginsDir, folder, 'index.js');

    const pluginModule = await import(pluginIndexPath);
    const pluginData = pluginModule.default;
    const pluginSrc = pluginData.src && pluginData.src.trim() !== '' ? pluginData.src : ``;

    const pluginName =
      pluginData.name && pluginData.name.trim() !== '' ? pluginData.name : `${folder}`;

    let pageUrls = [];

    if (fs.existsSync(pluginIndexPath)) {
      const fileContent = fs.readFileSync(pluginIndexPath, 'utf-8');

      // Regex to match pages.push or adminPages.push with a path property
      const pageUrlRegex = /(pages|adminPages)\.push\(\s*{[^}]*?path:\s*['"`]([^'"`]+)['"`]/g;

      let match;
      while ((match = pageUrlRegex.exec(fileContent)) !== null) {
        const rawPath = match[2]; // second capture group is the path string
        const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
        pageUrls.push(`/admin${normalizedPath}`);
      }
    }

    imports += `import ${importName} from '${importPath}';\n`;

    resolversArray += `  ${importName}.resolvers,\n`;
    typeDefsArray += `  ${importName}.typeDefs,\n`;

    metaArray +=
      `  {\n` +
      `    version: ${importName}.version,\n` +
      `    name: ${importName}.name,\n` +
      `    slug: '${folder}',\n` +
      `    pageUrls: ${JSON.stringify(pageUrls)},\n` +
      `    description: ${importName}.description || '',\n` +
      `    author: ${importName}.author || '',\n` +
      `    authorUrl: ${importName}.authorUrl || '',\n` +
      `    init: ${importName}.init,\n` +
      `    disable: ${importName}.disable,\n` +
      `    adminPageComponents: ${importName}.adminPageComponents || {},\n` +
      `    shortcodes: ${importName}.shortCodes || {},\n` +
      `    src: ${importName}.src || {},\n` +
      `  },\n`;

    pluginJsonArray.push({
      name: pluginName,
      src: pluginSrc,
    });

    index++;
  }

  resolversArray += '].filter(Boolean);\n\n';
  typeDefsArray += '].filter(Boolean);\n\n';
  metaArray += '].filter(Boolean);\n\n';

  const exports = `export { pluginResolvers, pluginTypeDefs, pluginMeta };\n`;
  return {
    jsOutput: imports + '\n' + resolversArray + typeDefsArray + metaArray + exports,
    jsonManifest: pluginJsonArray,
  };
}

async function main() {
  const pluginFolders = getPluginFolders(pluginsDir);
  const { jsOutput, jsonManifest } = await generateImportsAndExports(pluginFolders);
  fs.writeFileSync(outputFile, jsOutput, 'utf-8');
  console.log(`Generated pluginResolvers.js with ${pluginFolders.length} plugins.`);

  fs.writeFileSync(outputFileJSON, JSON.stringify(jsonManifest, null, 2), 'utf-8');
  console.log(`Generated plugin-manifest.json at ${outputFileJSON}`);
  process.exit(0); // Exit cleanly
}

main();
