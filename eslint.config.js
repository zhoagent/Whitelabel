import nkzw from '@nkzw/eslint-config';
import fbtee from '@nkzw/eslint-plugin-fbtee';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
  ...nkzw,
  // fbtee.configs.strict, // Temporarily removed for debugging fbt unused var
  {
    ignores: [
      '__generated__',
      '.expo',
      'android/',
      'dist/',
      'ios/',
      'vite.config.ts.timestamp-*',
    ],
  },
  {
    files: ['scripts/**/*.tsx'],
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
  // Moved the following block to the end for higher precedence
  // {
  //   plugins: {
  //     '@nkzw/fbtee': fbtee,
  //     '@typescript-eslint': tseslint,
  //   },
  //   rules: {
  //     '@nkzw/fbtee/no-untranslated-strings': 0,
  //     '@typescript-eslint/array-type': [2, { default: 'generic' }],
  //     '@typescript-eslint/no-restricted-imports': [
  //       2,
  //       {
  //         paths: [
  //           {
  //             importNames: ['Text'],
  //             message:
  //               'Please use the corresponding UI components from `src/ui/` instead.',
  //             name: 'react-native',
  //           },
  //           {
  //             importNames: ['ScrollView'],
  //             message:
  //               'Please use the corresponding UI component from `react-native-gesture-handler` instead.',
  //             name: 'react-native',
  //           },
  //           {
  //             importNames: ['BottomSheetModal'],
  //             message:
  //               'Please use the corresponding UI components from `src/ui/` instead.',
  //             name: '@gorhom/bottom-sheet',
  //           },
  //         ],
  //       },
  //     ],
  //     '@typescript-eslint/no-unused-vars': [
  //       'warn',
  //       {
  //         args: 'after-used',
  //         argsIgnorePattern: '^_',
  //         caughtErrorsIgnorePattern: '^_',
  //         ignoreRestSiblings: true,
  //         vars: 'all',
  //         varsIgnorePattern: '^(fbt|_.*)$',
  //       },
  //     ],
  //     'import-x/no-extraneous-dependencies': [
  //       2,
  //       {
  //         devDependencies: [
  //           './eslint.config.js',
  //           './scripts/**.tsx',
  //           './tailwind.config.ts',
  //           './vitest.config.js',
  //           '**/*.test.tsx',
  //         ],
  //       },
  //     ],
  //     'no-unused-vars': 'off',
  //   },
  //   settings: {
  //     'import-x/resolver': {
  //       typescript: {
  //         project: './tsconfig.json',
  //       },
  //     },
  //   },
  // },
  { // This is the moved block, now at the end
    plugins: {
      '@nkzw/fbtee': fbtee,
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@nkzw/fbtee/no-untranslated-strings': 0,
      '@typescript-eslint/array-type': [2, { default: 'generic' }],
      '@typescript-eslint/ban-types': 'warn', // Explicitly define the rule
      '@typescript-eslint/no-restricted-imports': [
        2,
        {
          paths: [
            {
              importNames: ['Text'],
              message:
                'Please use the corresponding UI components from `src/ui/` instead.',
              name: 'react-native',
            },
            {
              importNames: ['ScrollView'],
              message:
                'Please use the corresponding UI component from `react-native-gesture-handler` instead.',
              name: 'react-native',
            },
            {
              importNames: ['BottomSheetModal'],
              message:
                'Please use the corresponding UI components from `src/ui/` instead.',
              name: '@gorhom/bottom-sheet',
            },
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^(fbt|_.*)$',
        },
      ],
      'import-x/no-extraneous-dependencies': [
        2,
        {
          devDependencies: [
            './eslint.config.js',
            './scripts/**.tsx',
            './tailwind.config.ts',
            './vitest.config.js',
            '**/*.test.tsx',
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
