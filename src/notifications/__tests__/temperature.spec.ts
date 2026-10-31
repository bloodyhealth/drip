import notifee, { RepeatFrequency } from 'react-native-notify-kit'
import i18n from '@/i18n/i18n'
import { updateTemperatureReminder } from '@/notifications/temperature'
import { freezeTime, unfreezeTime } from '@/test/freeze-time'

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

const scheduledCalls = () => mockedNotifee.createTriggerNotification.mock.calls

const toTimestamp = (isoDateTime: string): number =>
  new Date(isoDateTime).getTime()

describe('updateTemperatureReminder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    freezeTime('2025-01-15T09:00:00+01:00')
  })

  afterEach(() => {
    unfreezeTime()
  })

  it('only cancels when the reminder is disabled', async () => {
    // Act
    await updateTemperatureReminder({ enabled: false, time: '09:00' })

    // Assert
    expect(notifee.cancelNotification).toHaveBeenCalledWith('temperature')
    expect(notifee.createTriggerNotification).not.toHaveBeenCalled()
  })

  it.each([
    {
      now: '2025-01-15T09:00:00+01:00',
      time: '08:00',
      expectedDateTime: '2025-01-16T08:00:00+01:00',
      expected: 'schedules for the next day when the time has passed',
    },
    {
      now: '2025-01-15T09:00:00+01:00',
      time: '10:00',
      expectedDateTime: '2025-01-15T10:00:00+01:00',
      expected: 'schedules for the same day when the time is ahead',
    },
    {
      now: '2025-01-15T09:00:00+01:00',
      time: '09:00',
      expectedDateTime: '2025-01-15T09:00:00+01:00',
      expected: 'schedules for the same day when the time is exactly now',
    },
    {
      now: '2025-01-15T09:00:30+01:00',
      time: '09:00',
      expectedDateTime: '2025-01-16T09:00:00+01:00',
      expected: 'schedules for the next day when seconds of the minute passed',
    },
    {
      now: '2025-01-15T09:00:00+01:00',
      time: '9:05',
      expectedDateTime: '2025-01-15T09:05:00+01:00',
      expected: 'accepts an hour without leading zero',
    },
    {
      now: '2025-12-31T23:30:00+01:00',
      time: '00:15',
      expectedDateTime: '2026-01-01T00:15:00+01:00',
      expected: 'rolls over into the next year',
    },
    {
      now: '2024-02-28T22:00:00+01:00',
      time: '07:00',
      expectedDateTime: '2024-02-29T07:00:00+01:00',
      expected: 'rolls over into a leap day',
    },
    {
      now: '2025-03-29T22:00:00+01:00',
      time: '08:00',
      expectedDateTime: '2025-03-30T08:00:00+02:00',
      expected: 'keeps the local time when the next day starts summer time',
    },
    {
      now: '2025-10-25T22:00:00+02:00',
      time: '08:00',
      expectedDateTime: '2025-10-26T08:00:00+01:00',
      expected: 'keeps the local time when the next day ends summer time',
    },
    {
      now: '2025-03-30T01:00:00+01:00',
      time: '02:30',
      expectedDateTime: '2025-03-30T03:30:00+02:00',
      expected: 'shifts a time skipped by the summer time switch forward',
    },
  ])('$expected', async ({ now, time, expectedDateTime }) => {
    // Arrange
    freezeTime(now)

    // Act
    await updateTemperatureReminder({ enabled: true, time })

    // Assert
    const [, trigger] = scheduledCalls()[0]
    expect(trigger).toMatchObject({
      timestamp: toTimestamp(expectedDateTime),
      repeatFrequency: RepeatFrequency.DAILY,
    })
  })

  it('uses texts of the language active at schedule time', async () => {
    // Arrange
    await i18n.changeLanguage('de-DE')

    // Act
    await updateTemperatureReminder({ enabled: true, time: '10:00' })

    // Assert
    const [notification] = scheduledCalls()[0]
    expect(notification.title).toBe('Erinnerung an Temperaturmessung')
    expect(notification.body).toBe('Miss deine Basaltemperatur')
    expect(notifee.createChannel).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Temperaturerinnerung' })
    )

    await i18n.changeLanguage('en-US')
  })
})
