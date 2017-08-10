import uglify from "rollup-plugin-uglify"
import buble from "rollup-plugin-buble"

export default {
  entry: "src/index.js",
  dest: "dist/picostyled.js",
  format: "umd",
  moduleName: 'picostyled',
  plugins: [
    buble(),
    uglify()
  ],
  external: [
    "picodom"
  ],
  paths: {
    picodom: "https://unpkg.com/picodom"
  },
  globals: {
    picodom: "picodom"
  },
  sourceMap: true,
}
