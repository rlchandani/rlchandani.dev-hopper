module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },
  ignorePatterns: [
    "/lib/**/*" // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
    "unused-imports",
    "simple-import-sort"
  ],
  rules: {
    "import/no-unresolved": 0,
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_"
      }
    ],
    "object-curly-spacing": ["error", "always"],
    "semi": "error",
    "quotes": ["error", "double"],
    "comma-dangle": ["error", "never"],
    "max-len": ["error", { code: 120, ignoreUrls: true }],
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2, { SwitchCase: 1 }],
    "arrow-parens": ["error", "always"],
    "comma-spacing": ["error", { before: false, after: true }],
    "quote-props": ["error", "consistent"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "no-duplicate-imports": ["error", { includeExports: true }],
    "no-loss-of-precision": "off",
    "no-nonoctal-decimal-escape": "off",
    "no-unsafe-optional-chaining": "off",
    "no-useless-backreference": "off",
    "operator-linebreak": "off"
  }
};
