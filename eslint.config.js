import nkzw from '@nkzw/eslint-config';
import fbtee from '@nkzw/eslint-plugin-fbtee';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
...nkzw,
fbtee.configs.strict, // Re-enabled for strict i18n linting
{
ignores: [
'generated',
'.expo',
'android/',
'dist/',
'ios/',
'vite.config.ts.timestamp-',
],
},
{
files: ['scripts/**/.tsx'],
rules: {
'no-console': 0,
},
},
{
files: ['metro.config.cjs'],
rules: {
'@typescript-eslint/no-require-imports': 0,
},
},
{
plugins: {
'@nkzw/fbtee': fbtee,
'@typescript-eslint': tseslint,
},
rules: {
// '@nkzw/fbtee/no-untranslated-strings': 0, // This line is covered by fbtee.configs.strict
'@typescript-eslint/array-type': [2, { default: 'generic' }],
'@typescript-eslint/ban-types': 'warn',
'@typescript-eslint/no-restricted-imports': [
2,
{
paths: [
{
importNames: ['Text'],
message:
'Please use the corresponding UI components from src/ui/ instead.',
name: 'react-native',
},
{
importNames: ['ScrollView'],
message:
'Please use the corresponding UI component from react-native-gesture-handler instead.',
name: 'react-native',
},
{
importNames: ['BottomSheetModal'],
message:
'Please use the corresponding UI components from src/ui/ instead.',
name: '@gorhom/bottom-sheet',
},
],
},
],
'@typescript-eslint/no-unused-vars': [
'warn',
{
args: 'after-used',
argsIgnorePattern: '^',
caughtErrorsIgnorePattern: '^',
ignoreRestSiblings: true,
vars: 'all',
varsIgnorePattern: '^(fbt|_.)$',
},
],
'import-x/no-extraneous-dependencies': [
2,
{
devDependencies: [
'./eslint.config.js',
'./scripts/.tsx',
'./tailwind.config.ts',
'./vitest.config.js',
'/.test.tsx',
],
},
],
'no-unused-vars': 'off',
},
settings: {
'import-x/resolver': {
typescript: {
project: './tsconfig.json',
},
},
},
},
];
