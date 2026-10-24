import React from 'react'
import StatsOverview from '../components/stats/stats-overview'

import i18n from '../i18n/i18n'
import { render, screen } from './test-utils'

const createRow = (overrides) => ({
  value: 28,
  label: 'Kürzester',
  ...overrides,
})

describe('StatsOverview', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en-US')
  })

  test('renders value and label of each row', () => {
    // Arrange
    const data = [createRow({ value: 25, label: 'Shortest' })]

    // Act
    render(<StatsOverview data={data} />)

    // Assert
    screen.getByText('25')
    screen.getByText('Shortest')
  })

  test('if language is German, renders asterisk for row with hasAsterisk', async () => {
    // Arrange
    await i18n.changeLanguage('de-DE')
    const data = [
      createRow(),
      createRow({
        value: 1.4,
        label: i18n.t('stats.overview.standardDeviation'),
        hasAsterisk: true,
      }),
    ]

    // Act
    render(<StatsOverview data={data} />)

    // Assert
    expect(screen.getAllByText('*')).toHaveLength(1)
  })

  test('does not render asterisk for rows without hasAsterisk', () => {
    // Arrange
    const data = [createRow(), createRow({ value: 3, label: 'Cycles' })]

    // Act
    render(<StatsOverview data={data} />)

    // Assert
    expect(screen.queryByText('*')).toBeNull()
  })
})
