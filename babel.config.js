export default function (api) {
  api.cache(true);

  return {
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@assets': './assets', // ADDED: Alias for the root assets directory
          },
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          root: ['./'],
        },
      ],
    ],
    presets: [
      '@nkzw/babel-preset-fbtee',
      ['babel-preset-expo', { jsxImportSource: 'nativewind', unstable_transformImportMeta: true }],
      'nativewind/babel',
    ],
  };
}
