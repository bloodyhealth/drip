interface ObservableStub<T> {
  value: T
}

function stub<T>(value: T): ObservableStub<T> {
  return { value }
}

export function makeLocalStorageMock(): Record<string, unknown> {
  return {
    fertilityTrackingObservable: stub(true),
    useCervixAsSecondarySymptomObservable: stub(false),
    scaleObservable: stub({ min: 35.5, max: 37.5 }),
    unitObservable: stub(0.1),
    temperatureTrackingCategoryObservable: stub(true),
    mucusTrackingCategoryObservable: stub(true),
    cervixTrackingCategoryObservable: stub(true),
    sexTrackingCategoryObservable: stub(true),
    desireTrackingCategoryObservable: stub(true),
    painTrackingCategoryObservable: stub(true),
    moodTrackingCategoryObservable: stub(true),
    noteTrackingCategoryObservable: stub(true),
    getChartFlag: jest.fn(() => Promise.resolve('false')),
    setChartFlag: jest.fn(),
  }
}
