import { fromRollup } from '@web/dev-server-rollup';
import html from 'rollup-plugin-html';


const htmlString = fromRollup(html);

export default {
  open: 'demo/',
  watch: true,
  nodeResolve: true,
  mimeTypes: {
    // serve template.html file as js
    '**/template.html': 'js',
  },
  plugins: [
    htmlString({
      include: '**/template.html',
    })
  ],
};