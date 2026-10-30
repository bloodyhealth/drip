import notifee from 'react-native-notify-kit'
import {
  advanceNoticeDaysObservable,
  periodPredictionObservable,
  periodReminderObservable,
} from '../../../local-storage'
import { updatePeriodReminder } from '../period'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}))

// prediction is computed from the db
const mockGetPredictedMenses = jest.fn()
jest.mock('../../cycle', () => () => ({
  getPredictedMenses: mockGetPredictedMenses,
}))

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

const scheduledCalls = () => mockedNotifee.createTriggerNotification.mock.calls

describe('updatePeriodReminder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // 2025-01-01 09:00 Europe/Berlin
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2025-01-01T08:00:00.000Z').getTime())

    advanceNoticeDaysObservable.set(3)
    periodReminderObservable.set({ enabled: true })
    periodPredictionObservable.set(true)
    mockGetPredictedMenses.mockReturnValue([['2025-01-10']])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('cancels the existing reminder before scheduling a new one', async () => {
    // Act
    await updatePeriodReminder()

    // Assert
    const cancelOrder =
      mockedNotifee.cancelNotification.mock.invocationCallOrder[0]
    const scheduleOrder =
      mockedNotifee.createTriggerNotification.mock.invocationCallOrder[0]
    expect(notifee.cancelNotification).toHaveBeenCalledWith('period')
    expect(cancelOrder).toBeLessThan(scheduleOrder)
  })

  it.each([
    { case: 'reminder is disabled', reminder: false, prediction: true },
    {
      case: 'period prediction is disabled',
      reminder: true,
      prediction: false,
    },
  ])('only cancels when $case', async ({ reminder, prediction }) => {
    // Arrange
    periodReminderObservable.set({ enabled: reminder })
    periodPredictionObservable.set(prediction)

    // Act
    await updatePeriodReminder()

    // Assert
    expect(notifee.cancelNotification).toHaveBeenCalledWith('period')
    expect(notifee.createTriggerNotification).not.toHaveBeenCalled()
  })

  it('does not schedule without predictions', async () => {
    // Arrange
    mockGetPredictedMenses.mockReturnValue([])

    // Act
    await updatePeriodReminder()

    // Assert
    expect(notifee.createTriggerNotification).not.toHaveBeenCalled()
  })

  it('does not schedule when the reminder date is in the past', async () => {
    // Arrange
    mockGetPredictedMenses.mockReturnValue([['2025-01-02']])

    // Act
    await updatePeriodReminder()

    // Assert
    expect(notifee.createTriggerNotification).not.toHaveBeenCalled()
  })

  it('schedules only the next prediction, advance notice days before at 6 am', async () => {
    // Arrange
    mockGetPredictedMenses.mockReturnValue([
      ['2025-01-10', '2025-01-11'],
      ['2025-02-10', '2025-02-11'],
    ])

    // Act
    await updatePeriodReminder()

    // Assert
    expect(scheduledCalls()).toHaveLength(1)
    const [, trigger] = scheduledCalls()[0]
    expect(trigger).toMatchObject({ timestamp: 1736226000000 }) // 2025-01-07 06:00 Europe/Berlin
  })

  it('respects the configured advance notice days', async () => {
    // Arrange
    advanceNoticeDaysObservable.set(5)
    mockGetPredictedMenses.mockReturnValue([['2025-01-15']])

    // Act
    await updatePeriodReminder()

    // Assert
    const [, trigger] = scheduledCalls()[0]
    expect(trigger).toMatchObject({ timestamp: 1736485200000 }) // 2025-01-10 06:00 Europe/Berlin
  })

  it('uses translated texts for body and channel name', async () => {
    // Arrange
    mockGetPredictedMenses.mockReturnValue([['2025-01-10', '2025-01-11']])

    // Act
    await updatePeriodReminder()

    // Assert
    const [notification] = scheduledCalls()[0]
    expect(notification.body).toBe(
      'Your next period is likely to start in 3 to 4 days.'
    )
    expect(notifee.createChannel).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'period', name: 'Period reminder' })
    )
  })
})
