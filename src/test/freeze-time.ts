export const freezeTime = (isoDateTime: string): void => {
  jest.useFakeTimers({
    now: new Date(isoDateTime),
    doNotFake: [
      'hrtime',
      'nextTick',
      'performance',
      'queueMicrotask',
      'requestAnimationFrame',
      'cancelAnimationFrame',
      'requestIdleCallback',
      'cancelIdleCallback',
      'setImmediate',
      'clearImmediate',
      'setInterval',
      'clearInterval',
      'setTimeout',
      'clearTimeout',
    ],
  })
}

export const unfreezeTime = (): void => {
  jest.useRealTimers()
}
