module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    process: {
      env: 'development',
    },
  },
  extends: ['eslint:recommended', 'airbnb-base', 'prettier', 'prettier/react'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    'react/jsx-uses-vars': 2,
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-underscore-dangle': ['error', { allow: ['_id']}],
    'no-unused-vars': ['error', { varsIgnorePattern: 'React' }],
    eqeqeq: ['error', 'always'],
  },
  plugins: ['react', 'import', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
