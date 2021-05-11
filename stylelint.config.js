module.exports = {
  extends: [
    'stylelint-config-standard'
  ],

  plugins: [
    'stylelint-scss'
  ],

  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [true, {
      ignoreAtRules: [
        // Tailwind words:
        'tailwind',
        'apply',
        'variants',
        'responsive',
        'screen',
        'layer',
      ],
    }],
    'font-family-no-missing-generic-family-keyword': null,
    'declaration-empty-line-before': null,
    'comment-empty-line-before': null,
    'length-zero-no-unit': null,
    'selector-list-comma-newline-after': 'always-multi-line',
  }
}
