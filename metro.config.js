// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from 'expo/metro-config';
import { withNativeWind } from 'nativewind/metro';
import path from 'path'; // For __dirname
import { fileURLToPath } from 'url'; // For __dirname
import { createRequire } from 'module'; // For require.resolve

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url); // For resolving paths like react-native-svg-transformer

/** @type {import('expo/metro-config').MetroConfig} */
const configBase = getDefaultConfig(__dirname);

const finalConfig = withNativeWind(
  {
    ...configBase,
    resolver: {
      ...configBase.resolver,
      assetExts: configBase.resolver.assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...configBase.resolver.sourceExts, 'svg', 'mjs', 'cjs'], // Added mjs, cjs for broader compatibility
    },
    transformer: {
      ...configBase.transformer,
      babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
    },
  },
  {
    input: './global.css',
    // output: 'nativewind-output.js', // Optional: if you want to specify output
  },
);

export default finalConfig;
