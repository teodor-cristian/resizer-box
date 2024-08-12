import terser from "@rollup/plugin-terser";

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
  ],
};
