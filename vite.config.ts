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
        api: 'modern-compiler'
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
        // 手动代码分割
        manualChunks(id) {
          // 库代码分割
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-vendor';
            } else if (id.includes('lodash') || id.includes('@vueuse')) {
              return 'utility';
            }
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
          // 样式代码分割
          if (id.includes('style.css')) {
            return 'styles';
          }
        },
        // 自动代码分割
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    },
    // 优化构建速度
    minify: 'esbuild',
    // 配置缓存策略
    cacheDir: './node_modules/.vite',
    // 控制输出文件大小
    chunkSizeWarningLimit: 1000,
    // 启用CSS代码分割
    cssCodeSplit: true
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
