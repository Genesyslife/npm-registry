import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import eslint from "@rollup/plugin-eslint";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import analyze from "rollup-plugin-analyzer";
import { v4 as uuid } from "uuid";

export default {
  input: "src/index.js",
  output: {
    file: "lib/index.js",
    format: "cjs",
    exports: "default",
    strict: false,
  },
  external: ["react", "react-dom", "three"],
  plugins: [
    postcss({
      modules: {
        generateScopedName(name) {
          return `${name}_${uuid().split("-")[0]}`;
        },
      },
      minimize: true,
      use: ["sass"],
      plugins: [
        autoprefixer({
          overrideBrowserslist: ["IE 11", "iOS 9"],
        }),
      ],
    }),
    eslint(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    analyze(),
  ],
};
