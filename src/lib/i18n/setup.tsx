/**
@fileoverview Initializes and configures the fbtee internationalization library.
@description This setup is crucial for enabling localized text throughout the application. It loads initial translations and configures fbtee hooks. Proper i18n setup directly impacts user experience, making the app more accessible and appealing (attraction) to a wider audience, contributing to higher engagement and ASO performance in different regions. Built for React Native 0.79, Expo 53, ESM.
Key features using the stack:
Configures fbtee with translation loading logic and viewer context hooks.
Loads initial translations (e.g., Japanese, English) from JSON files in '@/locales/'.
Uses functions from '@/lib/i18n/getLocale' for locale management.
@dependencies
fbtee
'@/locales/ja_JP.json' (translation file)
'@/locales/en_US.json' (translation file)
'@/lib/i18n/getLocale' (local i18n utilities)
@notes
This file should be imported early in the application lifecycle, typically in the root layout ('@/app/_layout.tsx').
This robust i18n setup enhances the template's value by enabling rapid localization for apps targeting diverse markets.
*/
// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import { IntlVariations, setupFbtee, TranslationTable } from 'fbtee';
import getLocale, {
  getTranslationsObject,
  setClientLocale,
  maybeLoadLocale,
} from './getLocale.tsx'; // Corrected import path

type FbtTranslationModule = {
  default: {
    fbLocale?: string;
    translations: { [hashKey: string]: TranslationTable };
  };
};

const loadLocaleFile = async (locale: string): Promise<{ [hashKey: string]: TranslationTable }> => {
  try {
    if (locale === 'ja_JP') {
      const module = await import(
        '@/locales/ja_JP.json'
      ) as any; // Import as any to bypass initial strict check
      return module.default.translations as { [hashKey: string]: TranslationTable }; // Assert return type
    }
    if (locale === 'en_US') {
      const module = await import(
        '@/locales/en_US.json'
      ) as any; // Import as any
      // en_US might be empty if it's the source language and strings are in code
      return (module.default.translations || {}) as { [hashKey: string]: TranslationTable }; // Assert return type
    }
    // Add other supported locales here
  } catch (error: unknown) { // Typed error
    console.error(`[fbtee_setup] Error loading translation file for ${locale}:`, error);
  }
  return {} as { [hashKey: string]: TranslationTable }; // Fallback, assert type
};

setupFbtee({
  hooks: {
    getViewerContext: () => ({
      GENDER: IntlVariations.GENDER_UNKNOWN,
      locale: getLocale(),
    }),
  },
  translations: getTranslationsObject(), // Initial empty or default translations
});

// Initialize with current device/stored locale and load its translations
const initialLocale = getLocale();
setClientLocale(initialLocale, loadLocaleFile).then(() => {
  // console.log([fbtee_setup] Initial locale ${initialLocale} processed.);
}).catch((error: unknown) => { // Typed error
  console.error(`[fbtee_setup] Error processing initial locale ${initialLocale}:`, error);
});

// Also ensure the default language translations are available if not already loaded by setClientLocale
// This is important if the initialLocale is different from the default and fails to load
maybeLoadLocale(getLocale('en_US'), loadLocaleFile).catch((error: unknown) => { // Typed error
  console.error(`[fbtee_setup] Error ensuring default locale translations:`, error);
});
// END WRITING FILE CODE
