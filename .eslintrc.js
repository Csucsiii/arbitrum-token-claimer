module.exports = {

    extends: ["plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    rules: {
        semi: ["error", "always"],
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/no-explicit-any": "off"
    },

    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        createDefaultProgram: true
    }
};