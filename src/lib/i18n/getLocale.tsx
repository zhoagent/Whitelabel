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
const translations: TranslationDictionary = { [_defaultLanguage]: {} };

for (const [locale] of AvailableLanguages) {
  availableLocales.set(locale, locale);
  availableLocales.set(locale.split('_')[0], locale);
}

export async function setClientLocale(
  locale: string,
  loadLocale: LocaleLoaderFn,
) {
  if (availableLocales.has(locale)) {
    await maybeLoadLocale(locale, loadLocale);
    if (locale !== currentLanguage) {
      currentLanguage = locale;
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

let currentLanguage: string | null;

export default function getLocale(defaultLanguage = _defaultLanguage): string {
  if (currentLanguage) {
    return currentLanguage;
  }

  for (const locale of getLocales()) {
    const localeName = availableLocales.get(locale);
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
  if (
    availableLocales.has(locale) &&
    !translations[locale] &&
    locale !== _defaultLanguage
  ) {
    translations[locale] = await loadLocale(locale);
  }
}
