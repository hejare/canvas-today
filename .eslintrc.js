module.exports = {
  "env": {
    "node": true,
    "es2020": true,
    "jest": true,
  },
  "globals": {
    "Buffer": true,
    "RequestInit": true,
    "FileReader": true,
    "ProgressEvent": true,
    "NodeJS": true,
  },
  "extends": [
    "eslint:recommended",
  ],
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
    },
  },
  "plugins": [
  ],
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
      },
    ],
    "linebreak-style": [
      "error",
      "unix",
    ],
    "quotes": [
      "error",
      "double",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true,
      },
    ],
    "semi": [
      "error",
      "always",
    ],
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
      },
    ],
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always",
      },
    ],
    "object-curly-spacing": [
      "error",
      "always",
    ],
    // Turn off rules that we are not interested in
    "prettier/prettier": "off",
    "no-bitwise": "off",
    "sonarjs/no-small-switch": "off",
    "sonarjs/no-identical-functions": "off",
    "jest/no-disabled-tests": "off",
    "no-case-declarations": "off",
    "no-undef": "error",

    // Make async code easier to maintain by highlighting common errors
    "no-return-await": "off",
    "sonarjs/no-duplicate-string": "off",
    "no-shadow": "off",

    // Turn off conflicting rules
    "brace-style": "off",
    "comma-spacing": "off",
    "lines-between-class-members": "off",
    "space-infix-ops": "off",
  },
};
