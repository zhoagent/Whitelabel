/**
 * @fileoverview Initializes and configures the fbtee internationalization library.
 * @description This setup is crucial for enabling localized text throughout the application. It loads initial translations and configures fbtee hooks. Proper i18n setup directly impacts user experience, making the app more accessible and appealing (attraction) to a wider audience, contributing to higher engagement and ASO performance in different regions. Built for React Native 0.79, Expo 53, ESM.
 *
 * Key features using the stack:
 * - Configures `fbtee` with translation loading logic and viewer context hooks.
 * - Loads initial translations (e.g., Japanese) from JSON files.
 * - Uses functions from `./getLocale.tsx` for locale management.
 *
 * @dependencies
 * - `fbtee`
 * - `../../locales/ja_JP.json` (translation file)
 * - `./getLocale.tsx` (local i18n utilities)
 *
 * @notes
 * - This file should be imported early in the application lifecycle, typically in the root layout (`'app/_layout.tsx`)' (see below for file content).
 */
import { IntlVariations, setupFbtee } from 'fbtee';
import getLocale, {
  getTranslationsObject,
  setClientLocale,
} from './getLocale.tsx';

setupFbtee({
  hooks: {
    getViewerContext: () => ({
      GENDER: IntlVariations.GENDER_UNKNOWN,
      locale: getLocale(),
    }),
  },
  translations: getTranslationsObject(),
});

setClientLocale(getLocale(), async (locale) => {
  try {
    if (locale === 'ja_JP') {
      const module = await import(
        `../../locales/ja_JP.json`
      );
      return module.default.translations;
    }
    if (locale === 'en_US') {
      // Attempt to load en_US.json to accommodate this potential locale.
      // If en_US.json does not exist, the import will fail and the catch block will handle it.
      const module = await import(
        `../../locales/en_US.json`
      );
      return module.default.translations;
    }
    // Add other supported locales here following the pattern:
    // if (locale === 'xx_XX') {
    //   const module = await import(`../../locales/xx_XX.json`, { assert: { type: 'json' } });
    //   return module.default.translations;
    // }
  } catch {
    // Error loading translation file (e.g., file not found for 'en_US' or other locales).
    // Silently fail or add more sophisticated error handling if required,
    // ensuring the app doesn't crash. For now, we fall through to return an empty object.
  }
  return {}; // Fallback for unhandled locales or if a file is missing/fails to load.
});
