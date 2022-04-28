module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "warn",
    "@typescript-eslint/no-explicit-any": "off",
  },
  overrides: [
    {
      files: ["**/*.d.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
