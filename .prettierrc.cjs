module.exports = {
  overrides: [{ files: '**/*.astro', options: { parser: 'astro' } }],
  plugins: [require.resolve('prettier-plugin-astro'), require.resolve('prettier-plugin-svelte')],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
}
