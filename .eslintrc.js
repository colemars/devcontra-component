module.exports = {
  env: {
    es6: true,
    browser: true
  },
  extends: [
    "airbnb",
    "prettier/react",
    "plugin:react/recommended",
    "prettier",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
  },
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  },
  plugins: [
    "prettier", "react"
  ],
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  },
  "parser": "babel-eslint"
};
