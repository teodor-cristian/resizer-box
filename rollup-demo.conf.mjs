import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import terser from "@rollup/plugin-terser";

export default {
  input: 'demo/index.html',
  output: {
    dir: 'demo-build'
  },
  plugins: [
    html(),
    terser()
  ],
};