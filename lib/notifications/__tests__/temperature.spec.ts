import notifee, { RepeatFrequency } from '@notifee/react-native'
import i18n from '../../../i18n/i18n'
import { updateTemperatureReminder } from '../temperature'

const mockedNotifee = notifee as jest.Mocked<typeof notifee>

const scheduledCalls = () => mockedNotifee.createTriggerNotification.mock.calls

describe('updateTemperatureReminder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // 2025-01-15 09:00 Europe/Berlin
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2025-01-15T08:00:00.000Z').getTime())
  })

  afterEach(() => {
    jest.restoreAllMocks()
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
      time: '08:00',
      expectedTimestamp: 1737010800000, // 2025-01-16 08:00 Europe/Berlin
      expected: 'schedules for the next day when the time has passed',
    },
    {
      time: '10:00',
      expectedTimestamp: 1736931600000, // 2025-01-15 10:00 Europe/Berlin
      expected: 'schedules for the same day when the time is ahead',
    },
  ])('$expected', async ({ time, expectedTimestamp }) => {
    // Act
    await updateTemperatureReminder({ enabled: true, time })

    // Assert
    const [, trigger] = scheduledCalls()[0]
    expect(trigger).toMatchObject({
      timestamp: expectedTimestamp,
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
