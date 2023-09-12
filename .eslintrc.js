/* eslint-disable quote-props */
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "plugins": [
    "@typescript-eslint",
  ],
  "rules": {
    "no-extra-semi": "error",
    "semi": ["error", "never"],
    "comma-dangle": ["error", "always-multiline"],
    "no-var": "error",
    "prefer-const": ["error", { "destructuring": "all" }],
    "quotes": ["error", "double"],
    "quote-props": ["error", "consistent-as-needed"],
    "no-duplicate-imports": "error",
    "comma-spacing": "error",
    "max-len": ["warn", {
      "code": 120,
      "ignoreComments": true,
      "ignoreTrailingComments": true,
    }],
    "array-bracket-spacing": ["error", "never"],
    "no-multiple-empty-lines": ["error", { "max": 1, "maxBOF": 0 }],
    "object-curly-spacing": ["error", "always"],
    "padded-blocks": ["error", "never"],
    "no-multi-spaces": ["error"],
    "space-infix-ops": ["error"],
    "@typescript-eslint/member-delimiter-style": ["error", {
      "multiline": {
        "delimiter": "none",
      },
      "singleline": {
        "requireLast": true,
        "delimiter": "semi",
      },
    }],
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      "accessibility": "explicit",
    }],
    "@typescript-eslint/member-ordering": [
      "error",
      {
        "default": [
          "public-static-field",
          "protected-static-field",
          "private-static-field",

          "public-abstract-field",
          "protected-abstract-field",

          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",

          "constructor",

          "public-static-method",
          "protected-static-method",
          "private-static-method",

          "public-abstract-method",
          "protected-abstract-method",

          "public-instance-method",
          "protected-instance-method",
          "private-instance-method",

          "method",
        ],
        "interfaces": "never",
        "typeLiterals": "never",
      },
    ],
  },
}
