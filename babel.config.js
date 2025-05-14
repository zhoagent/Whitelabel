export default function (api) {
  api.cache(true);

  return {
    presets: [
      '@nkzw/babel-preset-fbtee',
      ['babel-preset-expo', { jsxImportSource: 'nativewind', unstable_transformImportMeta: true }],
      'nativewind/babel',
    ],
  };
}
