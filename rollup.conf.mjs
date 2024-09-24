import terser from "@rollup/plugin-terser";
import html from 'rollup-plugin-html';

const pkgName = "resizer-box";

export default {
  input: "./src/index.mjs",
  output: {
    file: `lib/${pkgName}.min.js`,
    format: "umd",
    name: pkgName,
    sourcemap: true,
    interop: false,
  },
  plugins: [
    terser(),
    html({
      include: '**/template.html',
      htmlMinifierOptions: {
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
      }
    })
  ],
};
