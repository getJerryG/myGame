import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';
import viteCompression from 'vite-plugin-compression';

const PRECOMPRESS = {
  precompress: true,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // 构建结果分析
    visualizer({
      open: false,
      gzipSize: false,
      brotliSize: false,
      filename: 'visualizer.html'
    }),

    // 图片压缩
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: true
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 85,
        progressive: true
      },
      pngquant: {
        quality: [0.85, 0.95],
        speed: 3
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          },
          {
            name: 'cleanupIds',
            active: true
          }
        ]
      },
      // 压缩后替换原始文件
      replaceOrigin: true
    }),

    // Gzip 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    }),
    // Brotli 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        // 全局引入 SCSS 变量和工具
        additionalData: `
          @use 'sass:color';
          @use '@/styles/tokens' as tokens;
          @use '@/styles/utilities' as utils;
        `
      }
    },
    // 启用CSS代码分割
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  build: {
    // 生产环境下启用sourcemap
    sourcemap: false,
    // 代码分割策略
    rollupOptions: {
      // 启用Tree-shaking
      treeshake: true,
      output: {
        // 手动代码分割 - 优化策略
        manualChunks(id) {
          // 库代码分割
          if (id.includes('node_modules')) {
            // Vue 核心库
            if (id.includes('vue/dist') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-core';
            }
            // Vue 生态系统
            if (id.includes('@vue')) {
              return 'vue-ecosystem';
            }
            // 工具库
            if (id.includes('lodash') || id.includes('dayjs') || id.includes('axios')) {
              return 'utils';
            }
            // 图表库
            if (id.includes('chart.js') || id.includes('vue-chartjs')) {
              return 'charts';
            }
            // 其他第三方库按包名分割
            const match = id.match(/node_modules\/(?:@[^/]+\/)?([^/]+)/);
            if (match) {
              return `vendor-${match[1]}`;
            }
          }
          // 业务代码按功能分割
          if (id.includes('/src/stores/')) {
            return 'stores';
          }
          if (id.includes('/src/components/business/simulation/')) {
            return 'simulation-components';
          }
          if (id.includes('/src/components/business/')) {
            return 'business-components';
          }
          if (id.includes('/src/views/')) {
            return 'views';
          }
        },
        // 优化文件命名
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name.includes('vendor') || name.includes('vue') || name.includes('utils')) {
            return 'js/vendor/[name]-[hash].js';
          }
          return 'js/[name]-[hash].js';
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || '';
          if (info.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(info)) {
            return 'images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|ttf|otf|eot)$/.test(info)) {
            return 'fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // 使用 Terser 进行更激进的优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    // 配置缓存策略
    cacheDir: './node_modules/.vite',
    // 控制输出文件大小
    chunkSizeWarningLimit: 500,
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 启用 CSS 压缩
    cssMinify: true,
    // 目标浏览器
    target: 'es2015',
    // 动态导入优化
    dynamicImportVarsOptions: {
      warnOnError: true,
      exclude: [/node_modules/]
    }
  },
  server: PRECOMPRESS,
  preview: PRECOMPRESS,
  define: {
    // 暴露端口号给客户端代码
    'import.meta.env.VITE_PORT': JSON.stringify(5173),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['@vue'],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.d.ts', 'src/main.ts', 'src/App.tsx', 'src/components/**/*.vue'],
    },
  },
});
