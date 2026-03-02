const DEV = process.env.NODE_ENV !== 'production';
const path = require('path');

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  // plugins: ['@eslint/markdown'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.trae/',
    'tests/',
    'tailwind.config.js',
    'postcss.config.js',
    'vite.config.ts',
    '*.cjs',
    'test-type-rule.ts',
    ".config/",
    "**/*.test.ts",
    "**/*.spec.ts"
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: path.resolve(__dirname, '../tsconfig.json'),
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue'],
    allowImportExportEverywhere: false
  },
  plugins: [],
  rules: {
    // 控制台和调试器警告
    'no-console': DEV ? 'warn' : 'off',
    'no-debugger': DEV ? 'warn' : 'off',

    // 禁止使用var
    'no-var': 'error',

    // 强制使用const声明那些声明后不再被修改的变量
    'prefer-const': 'error',

    // 禁止使用中文变量名和不规范的命名
    'id-match': 'off',

    // 强制使用模板字面量而非字符串连接
    'prefer-template': 'warn',

    // 代码质量增强
    'eqeqeq': ['error', 'always'],
    'no-return-await': 'warn',
    'max-nested-callbacks': ['warn', 3],// 函数嵌套回调最多3层
    'max-params': ['warn', 10],// 函数最多10个参数
    'complexity': ['warn', { max: 15 }],// 函数复杂度最多15

    // 安全规则
    'no-eval': 'error',
    'no-new-func': 'error',
    'no-with': 'error',

    // 样式一致性
    'quotes': ['warn', 'double', { avoidEscape: true }],
    'no-trailing-spaces': 'warn',
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],// 最多2个空行，文件末尾不允许空行

    // Vue特定规则
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/no-unused-components': DEV ? 'warn' : 'error',
    'vue/require-name-property': DEV ? 'warn' : 'error',
    'vue/valid-define-emits': 'error',
    'vue/valid-define-props': 'error',
    'vue/multi-word-component-names': ['error', { ignores: ['index'] }],
    // 🔴 禁止v-html（避免XSS攻击，如需使用需手动禁用）
    'vue/no-v-html': 'warn',
    // 🔴 script-setup中使用的变量必须声明（避免未定义变量）
    'vue/script-setup-uses-vars': 'error',
    // 🔴 强制props默认值（避免props为undefined）
    'vue/require-default-prop': 'warn',
    // 🔴 禁止重复的属性（如<div v-if="a" v-if="b">）
    'vue/no-duplicate-attributes': 'error',
    // 🔴 强制v-for和v-if不混用（避免性能问题）
    'vue/no-use-v-if-with-v-for': 'error',
    // ts规则
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: false, ignoreProperties: false }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-loop-func': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: false }],
    '@typescript-eslint/no-dupe-class-members': 'warn',
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'explicit', overrides: { constructors: 'no-public' } }],
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
    '@typescript-eslint/consistent-indexed-object-style': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    // 🔴 补充：禁止空接口（避免冗余）
    '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
    // 🔴 补充：禁止使用命名空间（namespace，TS模块化推荐用ES模块）
    '@typescript-eslint/no-namespace': 'error',
    // 🔴 补充：强制使用可选链（?.）而非&&（提升代码可读性）
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/consistent-type-assertions': ['warn', { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow-as-parameter' }]
  },
  // overrides: [
  //   {
  //     files: ['*.md'],
  //     processor: '@eslint/markdown/markdown',
  //     extends: ['plugin:@eslint/markdown/recommended'],
  //     rules: {
  //       // 禁用一些不适用于Markdown的规则
  //       'no-console': 'off',
  //       'no-unused-vars': 'off',
  //       '@typescript-eslint/no-unused-vars': 'off'
  //     }
  //   },
  //   {
  //     files: ['**/*.md/*.*'],
  //     rules: {
  //       // 对Markdown中的代码块应用正常规则
  //       '@typescript-eslint/no-unused-vars': 'error'
  //     }
  //   }]

};