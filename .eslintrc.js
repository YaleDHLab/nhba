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
  extends: ['eslint:recommended', 'prettier', 'prettier/react'],
  rules: {
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        mjs: 'never',
      },
    ],
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    'max-len': [
      1,
      80,
      {
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
      },
    ],
    'no-console': ['error', { allow: ['warn', 'info'] }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-undef': ['error', { typeof: false }],
    'no-unused-vars': ['error', { varsIgnorePattern: 'React' }],
    'no-trailing-spaces': 2,
    quotes: ['error', 'single'],
    'react/jsx-uses-vars': 2,
  },
  plugins: ['react', 'import'],
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
