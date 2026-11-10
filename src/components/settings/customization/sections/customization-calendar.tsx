import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AppText } from '@/components/common/app-text'
import { Segment } from '@/components/common/segment'
import SelectTabGroup from '@/components/cycle-day/select-tab-group'
import {
  FirstDayOfWeek,
  firstDayOfWeekObservable,
  saveFirstDayOfWeek,
} from '@/local-storage'

export const CustomizationCalendar = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: 'sideMenu.settings.customization.calendar',
  })
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<FirstDayOfWeek>(
    firstDayOfWeekObservable.value
  )

  const firstDayOfWeekTabs = [
    { label: t('saturday'), value: FirstDayOfWeek.Saturday },
    { label: t('sunday'), value: FirstDayOfWeek.Sunday },
    { label: t('monday'), value: FirstDayOfWeek.Monday },
  ]

  const onSelectTab = (day: FirstDayOfWeek) => {
    setFirstDayOfWeek(day)
    saveFirstDayOfWeek(day)
  }

  return (
    <Segment title={t('title')}>
      <AppText>{t('firstDayOfWeek')}</AppText>
      <SelectTabGroup
        activeButton={firstDayOfWeek}
        buttons={firstDayOfWeekTabs}
        onSelect={onSelectTab}
        disabled={false}
        variant="secondary"
      />
    </Segment>
  )
}
