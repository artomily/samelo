import { describe, it, expect } from 'vitest'
import en from '@/i18n/en.json'
import es from '@/i18n/es.json'
import sw from '@/i18n/sw.json'
import pt from '@/i18n/pt.json'
import fr from '@/i18n/fr.json'
import id from '@/i18n/id.json'

const ALL_LOCALES = { en, es, sw, pt, fr, id }
const EN_KEYS = Object.keys(en)

describe('i18n completeness', () => {
  for (const [locale, translations] of Object.entries(ALL_LOCALES)) {
    it(`${locale}.json has all keys from en.json`, () => {
      const missingKeys = EN_KEYS.filter(k => !(k in translations))
      expect(missingKeys, `${locale} missing: ${missingKeys.join(', ')}`).toHaveLength(0)
    })
  }

  it('all locale files are valid JSON (no undefined values)', () => {
    for (const [locale, translations] of Object.entries(ALL_LOCALES)) {
      for (const [key, value] of Object.entries(translations)) {
        expect(typeof value, `${locale}.${key} should be string`).toBe('string')
        expect(value, `${locale}.${key} should not be empty`).toBeTruthy()
      }
    }
  })
})
