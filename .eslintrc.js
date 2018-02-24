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
  extends: ['eslint:recommended', 'airbnb', 'prettier', 'prettier/react'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'none',
      },
    ],
    'consistent-return': 'off',
    'react/jsx-uses-vars': 2,
    'react/prop-types': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-underscore-dangle': ['error', { allow: ['_id']}],
    'no-unused-vars': ['error', { varsIgnorePattern: 'React' }],
    'new-cap': 'off',
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
