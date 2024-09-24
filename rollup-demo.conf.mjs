import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import terser from "@rollup/plugin-terser";
import htmlString from 'rollup-plugin-html';

const GOOGLE_ANALYTICS_CODE = "G-P775S8ZZXZ";

export default {
  input: 'demo/index.html',
  output: {
    dir: 'demo-build'
  },
  plugins: [
    html({
      transformHtml: [
        html => html.replaceAll('GOOGLE_ANALYTICS_CODE', GOOGLE_ANALYTICS_CODE)
      ],
    }),
    htmlString({
      include: '**/template.html'
    }),
    terser(),
  ],
};