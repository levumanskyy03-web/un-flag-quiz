import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mathDigitPrefixesOk, matchedDigits, normalizeTypedDigits, digitRunStatus } from './mathDigits'

test('constant prefixes and length', () => {
  assert.equal(mathDigitPrefixesOk(), true)
})

test('typed prefix stops at the first wrong digit', () => {
  assert.equal(matchedDigits('14159', '1415926535'), 5)
  assert.equal(matchedDigits('14150', '1415926535'), 4)
  assert.equal(digitRunStatus('14150', '14159'), 'miss')
  assert.equal(digitRunStatus('14159', '14159'), 'done')
  assert.equal(digitRunStatus('141', '14159'), 'typing')
})

test('paste may include the integer part', () => {
  assert.equal(normalizeTypedDigits('3.14159', '3.'), '14159')
  assert.equal(normalizeTypedDigits('3,14159', '3.'), '14159')
  assert.equal(normalizeTypedDigits('141 592', '3.'), '141592')
})
