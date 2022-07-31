import chai from 'chai'

import { isObject } from '../lib/helpers'

const expect = chai.expect

describe('isObject', () => {
  describe('returns true', () => {
    it('if value is empty object', () => expect(isObject({})).to.eql(true))
    it('if value is  object', () =>
      expect(
        isObject({ field1: 'text', field2: {}, field3: null, field4: [1, 2] })
      ).to.eql(true))
    it('if value is new empty object', () =>
      expect(isObject(Object.create({}))).to.eql(true))
    it('if value is new object with null prototype', () =>
      expect(isObject(Object.create(null))).to.eql(true))
    it('if value is new object with Object.prototype', () =>
      expect(isObject(Object.create(Object.prototype))).to.eql(true))
  })

  describe('returns false', () => {
    it('if value is null', () => expect(isObject(null)).to.eql(false))
    it('if value is undefined', () => expect(isObject(undefined)).to.eql(false))
    it('if value is empty string', () => expect(isObject('')).to.eql(false))
    it('if value is string', () => expect(isObject('abc')).to.eql(false))
    it('if value is boolean', () => expect(isObject(false)).to.eql(false))
    it('if value is int', () => expect(isObject(123)).to.eql(false))
    it('if value is empty array', () => expect(isObject([])).to.eql(false))
    it('if value is new array', () =>
      expect(isObject(new Array())).to.eql(false))
    it('if value is array', () => expect(isObject([1, 2, 3])).to.eql(false))
    it('if value is a function', () =>
      expect(isObject(function () {})).to.eql(false))
    it('if value is a function shorthand', () =>
      expect(isObject(() => {})).to.eql(false))
  })
})
