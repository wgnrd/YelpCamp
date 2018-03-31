module.exports = {
  extends: 'airbnb-base',
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'max-len': ['warn', 140],
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    standard: { env: ['mocha'] },
  },
};
