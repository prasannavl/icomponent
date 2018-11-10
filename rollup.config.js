import filesize from 'rollup-plugin-filesize';
import {terser} from 'rollup-plugin-terser';

export default {
  input: './lib/index.js',
  output: {
    file: './dist/index.bundle.js',
    format: 'umd',
    name: "icomponent",
  },
  plugins: [
    terser({
      warnings: true,
      mangle: {
        module: true,
      },
    }),
    filesize({
      showBrotliSize: true,
    })
  ]
}
