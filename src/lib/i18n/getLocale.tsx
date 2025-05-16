/**
 * @fileoverview Manages locale detection and setting for internationalization using fbtee.
 * @description This utility is foundational for providing localized user experiences, which is key to user attraction and accessibility. A well-localized app feels more personal and trustworthy, contributing to better engagement and retention. It's designed for React Native 0.79, Expo 53, ESM, and leverages Expo's localization capabilities.
 *
 * Key features using the stack:
 * - Uses `expo-localization` to get device locales.
 * - Integrates with `fbtee` for translation dictionary management.
 * - Provides functions to set and get the current application locale.
 *
 * @dependencies
 * - `@nkzw/core/isPresent`
 * - `expo-localization`
 * - `fbtee`
 *
 * @returns
 * - `getLocale()`: Returns the current application locale string.
 * - `setClientLocale()`: Sets the application's locale and loads translations.
 * - `getLocales()`: Provides an array of prioritized locales.
 * - `getTranslationsObject()`: Returns the fbtee translations dictionary.
 * - `maybeLoadLocale()`: Loads locale-specific translations if not already loaded.
 *
 * @notes
 * - The default language is 'en_US'.
 * - This module is a core part of the internationalization strategy, crucial for global market penetration and user satisfaction.
 */

// BEGIN WRITING FILE CODE (TypeScript with JSX, NativeWind classNames)
import isPresent from '@nkzw/core/isPresent.js';
import { getLocales as getDeviceLocales } from 'expo-localization';
import { TranslationDictionary, TranslationTable } from 'fbtee';

const AvailableLanguages = new Map([
  ['en_US', 'English'],
  ['ja_JP', '日本語 (Japanese)'],
] as const);

type LocaleLoaderFn = (
  locale: string,
) => Promise<{ [hashKey: string]: TranslationTable }>;

const _defaultLanguage = 'en_US';
const availableLocales = new Map<string, string>();
const translations: TranslationDictionary = { [_defaultLanguage]: {} }; // Initialize with default language translations

for (const [locale] of AvailableLanguages) {
  availableLocales.set(locale, locale);
  availableLocales.set(locale.split('_')[0], locale); // map 'en' to 'en_US'
}

export async function setClientLocale(
  locale: string,
  loadLocale: LocaleLoaderFn,
) {
  const targetLocale = availableLocales.get(locale) || availableLocales.get(locale.split(/[-_]/)[0]) || _defaultLanguage;
  if (targetLocale) {
    await maybeLoadLocale(targetLocale, loadLocale);
    if (targetLocale !== currentLanguage) {
      currentLanguage = targetLocale;
    }
  }
}

export function getLocales({
  fallback = _defaultLanguage,
} = {}): ReadonlyArray<string> {
  return Array.from(
    new Set(
      [...getDeviceLocales().map(({ languageTag }) => languageTag), fallback]
        .flatMap((locale: string) => {
          if (!locale) {
            return null;
          }
          const [first = '', second] = locale.split(/-|_/);
          return [
            `${first.toLowerCase()}${second ? `_${second.toUpperCase()}` : ''}`,
            first.toLowerCase(),
          ];
        })
        .filter(isPresent),
    ),
  );
}

let currentLanguage: string | null = null; // Initialize as null

export default function getLocale(defaultLanguage = _defaultLanguage): string {
  if (currentLanguage) {
    return currentLanguage;
  }

  for (const locale of getLocales({fallback: defaultLanguage})) {
    const localeName = availableLocales.get(locale) || availableLocales.get(locale.split(/[-_]/)[0]);
    if (localeName) {
      currentLanguage = localeName;
      return localeName;
    }
  }
  currentLanguage = defaultLanguage;
  return defaultLanguage;
}

export function getTranslationsObject() {
  return translations;
}

export async function maybeLoadLocale(
  locale: string,
  loadLocale: LocaleLoaderFn,
) {
  const targetLocale = availableLocales.get(locale) || availableLocales.get(locale.split(/[-_]/)[0]) || _defaultLanguage;
  if (
    targetLocale &&
    !translations[targetLocale] && // Check if translations for the resolved targetLocale are loaded
    targetLocale !== _defaultLanguage // Don't try to load default if it's already the base
  ) {
    try {
        const loadedTranslations = await loadLocale(targetLocale);
        translations[targetLocale] = loadedTranslations;
    } catch (error) {
        console.error(`Failed to load translations for ${targetLocale}:`, error);
        translations[targetLocale] = {}; // Ensure the key exists to prevent re-attempts
    }
  } else if (targetLocale === _defaultLanguage && !translations[_defaultLanguage]) {
    // Ensure default language is loaded if somehow missed.
    try {
        const loadedTranslations = await loadLocale(_defaultLanguage);
        translations[_defaultLanguage] = loadedTranslations;
    } catch (error) {
        console.error(`Failed to load default translations for ${_defaultLanguage}:`, error);
        translations[_defaultLanguage] = {};
    }
  }
}
// END WRITING FILE CODE
