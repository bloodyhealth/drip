import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Dimensions, PixelRatio, StyleSheet, View } from 'react-native'

import AppPage from '../common/app-page'

import DayColumn from './day-column'
import HorizontalGrid from './horizontal-grid'
import MainGrid from './main-grid'
import NoData from './no-data'
import NoTemperature from './no-temperature'
import Tutorial from './Tutorial'
import YAxis from './y-axis'

import { getCycleDaysSortedByDate } from '../../db'
import {
  getChartFlag,
  setChartFlag,
  desireTrackingCategoryObservable,
  moodTrackingCategoryObservable,
  noteTrackingCategoryObservable,
  painTrackingCategoryObservable,
  sexTrackingCategoryObservable,
  temperatureTrackingCategoryObservable,
  mucusTrackingCategoryObservable,
  cervixTrackingCategoryObservable,
} from '../../local-storage'
import { makeColumnInfo } from '../helpers/chart'

import {
  CHART_COLUMN_WIDTH,
  CHART_GRID_LINE_HORIZONTAL_WIDTH,
  CHART_SYMPTOM_HEIGHT_RATIO,
  CHART_XAXIS_HEIGHT_RATIO,
  SYMPTOMS,
} from '../../config'
import { Spacing } from '../../styles'

const getSymptomsFromCycleDays = (cycleDays) =>
  SYMPTOMS.filter((symptom) => cycleDays.some((cycleDay) => cycleDay[symptom]))

const CycleChart = ({ navigate, setDate }) => {
  const [shouldShowHint, setShouldShowHint] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function checkShouldShowHint() {
      const flag = await getChartFlag()
      if (isMounted) {
        setShouldShowHint(flag === 'true')
      }
    }

    checkShouldShowHint()

    return () => {
      isMounted = false
    }
  }, [])

  const hideHint = useCallback(() => {
    setShouldShowHint(false)
    setChartFlag()
  }, [])

  // Memoize cycle days to avoid re-fetching on every render
  // Convert Realm Results to array to ensure stable reference
  const cycleDaysSortedByDate = useMemo(() => {
    const results = getCycleDaysSortedByDate()
    // Convert Realm Results to array for stable reference
    return Array.from(results)
  }, [])

  // Memoize chart symptoms based on cycle days
  const chartSymptoms = useMemo(
    () => getSymptomsFromCycleDays(cycleDaysSortedByDate),
    [cycleDaysSortedByDate]
  )

  // Memoize symptom row symptoms (excluding temperature)
  const symptomRowSymptoms = useMemo(
    () => chartSymptoms.filter((symptom) => symptom !== 'temperature'),
    [chartSymptoms]
  )

  // Memoize enabled symptoms based on observable values
  const symptomRowEnabledSymptoms = useMemo(() => {
    return symptomRowSymptoms.filter((symptom) => {
      if (symptom === 'sex') {
        return sexTrackingCategoryObservable.value ? symptom : null
      } else if (symptom === 'mucus') {
        return mucusTrackingCategoryObservable.value ? symptom : null
      } else if (symptom === 'cervix') {
        return cervixTrackingCategoryObservable.value ? symptom : null
      } else if (symptom === 'desire') {
        return desireTrackingCategoryObservable.value ? symptom : null
      } else if (symptom === 'pain') {
        return painTrackingCategoryObservable.value ? symptom : null
      } else if (symptom === 'mood') {
        return moodTrackingCategoryObservable.value ? symptom : null
      } else if (symptom === 'note') {
        return noteTrackingCategoryObservable.value ? symptom : null
      } else {
        return symptom
      }
    })
  }, [symptomRowSymptoms])

  // Memoize temperature-related flags
  const isTemperatureEnabled = useMemo(
    () => temperatureTrackingCategoryObservable.value,
    []
  )
  const shouldShowTemperatureColumn = useMemo(
    () => isTemperatureEnabled && chartSymptoms.indexOf('temperature') > -1,
    [isTemperatureEnabled, chartSymptoms]
  )
  const shouldShowNoDataWarning = useMemo(
    () => isTemperatureEnabled && chartSymptoms.indexOf('temperature') <= -1,
    [isTemperatureEnabled, chartSymptoms]
  )

  // Memoize dimensions and layout calculations
  const dimensions = useMemo(() => Dimensions.get('window'), [])
  const { width, height } = dimensions
  const numberOfColumnsToRender = useMemo(
    () => Math.round(width / CHART_COLUMN_WIDTH),
    [width]
  )

  const xAxisHeight = useMemo(
    () => height * 0.7 * CHART_XAXIS_HEIGHT_RATIO,
    [height]
  )
  const remainingHeight = useMemo(
    () => height * 0.7 - xAxisHeight,
    [height, xAxisHeight]
  )
  const symptomHeight = useMemo(
    () =>
      PixelRatio.roundToNearestPixel(
        remainingHeight * CHART_SYMPTOM_HEIGHT_RATIO
      ),
    [remainingHeight]
  )
  const symptomRowHeight = useMemo(
    () =>
      PixelRatio.roundToNearestPixel(
        symptomRowEnabledSymptoms.length * symptomHeight
      ) + CHART_GRID_LINE_HORIZONTAL_WIDTH,
    [symptomRowEnabledSymptoms, symptomHeight]
  )
  const columnHeight = useMemo(
    () => remainingHeight - symptomRowHeight,
    [remainingHeight, symptomRowHeight]
  )

  const chartHeight = useMemo(
    () =>
      shouldShowTemperatureColumn
        ? height * 0.7
        : symptomRowHeight + xAxisHeight,
    [shouldShowTemperatureColumn, height, symptomRowHeight, xAxisHeight]
  )

  // Memoize content container style to avoid creating new object on every render
  const contentContainerStyle = useMemo(
    () => ({ height: chartHeight }),
    [chartHeight]
  )

  // Memoize columns to avoid creating new array on every render
  const columns = useMemo(() => makeColumnInfo(), [])

  // Use useCallback to prevent renderColumn from being recreated on every render
  const renderColumn = useCallback(
    ({ item }) => {
      return (
        <DayColumn
          setDate={setDate}
          dateString={item}
          navigate={navigate}
          symptomHeight={symptomHeight}
          columnHeight={columnHeight}
          symptomRowSymptoms={symptomRowEnabledSymptoms}
          chartSymptoms={chartSymptoms}
          shouldShowTemperatureColumn={shouldShowTemperatureColumn}
          xAxisHeight={xAxisHeight}
        />
      )
    },
    [
      setDate,
      navigate,
      symptomHeight,
      columnHeight,
      symptomRowEnabledSymptoms,
      chartSymptoms,
      shouldShowTemperatureColumn,
      xAxisHeight,
    ]
  )

  const hasDataToDisplay = chartSymptoms.length > 0

  if (!hasDataToDisplay) {
    return <NoData navigate={navigate} />
  }

  return (
    <AppPage
      contentContainerStyle={styles.pageContainer}
      scrollViewStyle={styles.page}
    >
      <View style={styles.chartContainer}>
        {shouldShowHint && <Tutorial onClose={hideHint} />}
        {shouldShowNoDataWarning && <NoTemperature />}
        <View style={styles.chartArea}>
          <YAxis
            height={columnHeight}
            symptomsToDisplay={symptomRowEnabledSymptoms}
            symptomsSectionHeight={symptomRowHeight}
            shouldShowTemperatureColumn={shouldShowTemperatureColumn}
            xAxisHeight={xAxisHeight}
          />
          <MainGrid
            data={columns}
            renderItem={renderColumn}
            initialNumToRender={numberOfColumnsToRender}
            contentContainerStyle={contentContainerStyle}
          />
          {shouldShowTemperatureColumn && (
            <HorizontalGrid height={columnHeight} />
          )}
        </View>
      </View>
    </AppPage>
  )
}

CycleChart.propTypes = {
  navigate: PropTypes.func,
  setDate: PropTypes.func,
}

const styles = StyleSheet.create({
  chartArea: {
    flexDirection: 'row',
  },
  chartContainer: {
    flexDirection: 'column',
  },
  page: {
    marginVertical: Spacing.small,
  },
  pageContainer: {
    paddingHorizontal: Spacing.base,
  },
})

export default CycleChart
