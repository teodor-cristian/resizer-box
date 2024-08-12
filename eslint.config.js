import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    languageOptions: { globals: globals.browser },
  },
  {
    ignores: ["**/*.spec.*"]
  },
  pluginJs.configs.recommended,
];