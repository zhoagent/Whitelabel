export default function (api) {
  api.cache(true);

  return {
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@assets': './src/assets',
          },
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          root: ['./'],
        },
      ],
    ],
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind', unstable_transformImportMeta: true }],
      'nativewind/babel',
    ],
  };
}
