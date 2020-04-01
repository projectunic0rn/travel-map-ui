module.exports = {
  "extends": [
    "airbnb-base",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    "react/jsx-uses-react": 1
  },
  "env": {
    "browser": true,
    "mocha": true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "plugins": [
    "react",
    "jest"
  ]
};
