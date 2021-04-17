module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],

  plugins: [
  ],

  rules: {
    /*
     * eslint rules
     */
    'arrow-parens': ['error', 'always'],
    'brace-style': ['error', 'stroustrup', { 'allowSingleLine': true }],
    'comma-dangle': ['error', 'only-multiline'],
    'camelcase': 'off',
    'no-lonely-if': 'off',
    'no-unused-vars': 'off', // disabled because JSDoc types are not recognized
    'object-shorthand': 'off',
    'quote-props': ['error', 'consistent'],
    'import/order': 'off',
    'no-useless-constructor': 'off',
    'require-await': 'off',
    /*
     * vue rules
     */
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'any',
        'component': 'always'
      }
    }],
    'vue/singleline-html-element-content-newline': 'off'
  }
}
