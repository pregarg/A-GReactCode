import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"


export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      'prettier': eslintPluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
    }
  },
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended
];