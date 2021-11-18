const path = require('path');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.glsl$/,
        use: [
          {
            loader: 'raw-loader',
            options: {},
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.glsl'],
  },
  plugins: [
    new WasmPackPlugin({
      crateDirectory: path.join(__dirname, 'rust'),
      forceMode: 'production',
    }),
  ],
};
