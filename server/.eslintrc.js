module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.build.json',
    sourceType: 'module',
    ecmaVersion: 2021,
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules'],
  rules: {
    // 禁用与NestJS装饰器相关的规则
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'prefer-const': 'off',
    'no-var': 'off',
    // 允许非空断言
    '@typescript-eslint/no-non-null-assertion': 'off',
    // 允许短路运算符
    '@typescript-eslint/no-unused-expressions': 'off',
  },
}; 