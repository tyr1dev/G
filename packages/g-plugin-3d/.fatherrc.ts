import glslify from 'rollup-plugin-glslify';

export default {
  cjs: 'rollup',
  esm: 'rollup',
  extraRollupPlugins: [
    glslify({
      // disable compressing shader
      // @see https://github.com/antvis/g/issues/832
      compress: false,
    }),
  ],
  umd: {
    name: 'G.3D',
    globals: {
      '@antv/g-lite': 'window.G',
      '@antv/g-plugin-device-renderer': 'window.G.WebGL.DeviceRenderer',
    },
  },
};
