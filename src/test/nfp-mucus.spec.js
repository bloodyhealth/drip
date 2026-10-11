import getNfpMucus from '../lib/nfp-mucus'

describe('getNfpMucus', () => {
  test('returns null if there is no value for feeling or texture', () => {
    expect(getNfpMucus()).toBeNull()
    expect(getNfpMucus(undefined, 3)).toBeNull()
    expect(getNfpMucus(2, undefined)).toBeNull()
  })

  describe('results in t for:', () => {
    test('dry feeling and no texture', function () {
      const nfpValue = getNfpMucus(0, 0)
      expect(nfpValue).toEqual(0)
    })
  })

  describe('results in Ø for:', () => {
    test('no feeling and no texture', function () {
      const nfpValue = getNfpMucus(1, 0)
      expect(nfpValue).toEqual(1)
    })
  })

  describe('results in f for:', () => {
    test('wet feeling and no texture', function () {
      const nfpValue = getNfpMucus(2, 0)
      expect(nfpValue).toEqual(2)
    })
  })

  describe('results in S for:', () => {
    test('dry feeling and creamy texture', function () {
      const nfpValue = getNfpMucus(0, 1)
      expect(nfpValue).toEqual(3)
    })

    test('no feeling and creamy texture', function () {
      const nfpValue = getNfpMucus(1, 1)
      expect(nfpValue).toEqual(3)
    })

    test('wet feeling and creamy texture', function () {
      const nfpValue = getNfpMucus(2, 1)
      expect(nfpValue).toEqual(3)
    })
  })

  describe('results in +S for:', () => {
    test('dry feeling and egg white texture', function () {
      const nfpValue = getNfpMucus(0, 2)
      expect(nfpValue).toEqual(4)
    })

    test('no feeling and egg white texture', function () {
      const nfpValue = getNfpMucus(1, 2)
      expect(nfpValue).toEqual(4)
    })

    test('wet feeling and egg white texture', function () {
      const nfpValue = getNfpMucus(2, 2)
      expect(nfpValue).toEqual(4)
    })

    test('slippery feeling and egg white texture', function () {
      const nfpValue = getNfpMucus(3, 2)
      expect(nfpValue).toEqual(4)
    })

    test('slippery feeling and creamy texture', function () {
      const nfpValue = getNfpMucus(3, 1)
      expect(nfpValue).toEqual(4)
    })

    test('slippery feeling and no texture', function () {
      const nfpValue = getNfpMucus(3, 0)
      expect(nfpValue).toEqual(4)
    })
  })
})
