module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    'removeDimensions',
    { name: 'convertPathData', params: { floatPrecision: 2 } },
    'mergePaths',
    'convertShapeToPath',
  ],
};
