import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const isDev = mode === 'development';

  return {
    define: {
      __DEV__: JSON.stringify(isDev),
    },
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      viteStaticCopy({
        targets: [
          {
            src: 'src/Plugins/*/Utils/plugin-bundle.js',
            dest: 'plugins',
            rename: (name, extension, fullPath) => {
              // extract the plugin folder name
              const match = fullPath.match(/src\/Plugins\/([^/\\]+)\//);
              if (match) {
                const pluginName = match[1];
                return `${pluginName}/plugin-bundle.js`;
              }
              return `${name}.${extension}`;
            },
          },
        ],
      }),
      // Bundle analyzer - only in production builds
      isProduction && visualizer({
        filename: 'bundle-analyzer.html',
        open: false, // Set to true to auto-open in browser
        gzipSize: true,
        brotliSize: true
      }),
    ].filter(Boolean),
    build: {
      outDir: '../backend/dist',
      emptyOutDir: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug'], // optionally remove more
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = path.normalize(id);

            if (normalizedId.includes('node_modules')) {
              if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(normalizedId)) {
                return 'vendor-react';
              }
              if (
                /node_modules[\\/](?:@tinymce[\\/](miniature|tinymce-react))/.test(normalizedId)
              ) {
                return 'vendor-tinymce';
              }

              if (/node_modules[\\/]@headlessui[\\/]react[\\/]/.test(normalizedId)) {
                return 'vendor-headless-ui';
              }

              if (/node_modules[\\/](flowbite-datepicker|flowbite)[\\/]/.test(normalizedId)) {
                return 'vendor-flowbite';
              }

              if (
                /node_modules[\\/](react-beautiful-dnd|@dnd-kit[\\/](core|sortable)|@hello-pangea[\\/]dnd)[\\/]/.test(
                  normalizedId,
                )
              ) {
                return 'vendor-dnd';
              }

              if (/node_modules[\\/](date-fns|react-helmet-async|react-colorful|react-easy-crop|react-image-crop)[\\/]/.test(normalizedId)) {
                return 'vendor-utils';
              }

              if (/node_modules[\\/](marked|lz-string|uuidv4|html-react-parser|dompurify)[\\/]/.test(normalizedId)) {
                return 'vendor-text-utils';
              }

              return 'vendor-other';
            }
            if (normalizedId.includes('src/index.') || normalizedId.includes('src\\index.')) {
              return 'app-main';
            }
            if (normalizedId.includes('src/Admin/')) {
              if (normalizedId.includes('src/Admin/Components/')) {
                if (normalizedId.includes('src/Admin/Components/Appearance')) {
                  return 'admin-components-appearance';
                }
                if (normalizedId.includes('src/Admin/Components/Comments')) {
                  return 'admin-components-comments';
                }
                if (normalizedId.includes('src/Admin/Components/CustomFieldComponents')) {
                  return 'admin-components-customfields';
                }
                if (normalizedId.includes('src/Admin/Components/CustomPosts')) {
                  return 'admin-components-customposts';
                }
                if (normalizedId.includes('src/Admin/Components/Media')) {
                  return 'admin-components-media';
                }
                if (normalizedId.includes('src/Admin/Components/Pages')) {
                  return 'admin-components-pages';
                }
                if (normalizedId.includes('src/Admin/Components/Plugins')) {
                  return 'admin-components-plugins';
                }
                if (normalizedId.includes('src/Admin/Components/Posts')) {
                  return 'admin-components-posts';
                }
                if (normalizedId.includes('src/Admin/Components/Settings')) {
                  return 'admin-components-settings';
                }
              }
              if (normalizedId.includes('src/Admin/Pages/')) {
                return 'admin-pages';
              }
              return 'admin-core';
            }
            if (normalizedId.includes('src/Plugins/') || normalizedId.includes('src\\Plugins\\')) {
              return 'plugins';
            }
            const themeMatch = normalizedId.match(/src[/\\]Content[/\\]([^/\\]+)[/\\]/);
            if (themeMatch) {
              const themeName = themeMatch[1].toLowerCase();
              return `theme-${themeName}`;
            }
            return 'app-shared';
          },
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    server: {
      watch: {
        // ignored: ['**/src/Plugins/**'],
      },
      proxy: {
        '/api/v1': {
          target: 'http://localhost',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.md'],
    optimizeDeps: {
      exclude: ['refractor'],
    },
  };
});
