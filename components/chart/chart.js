import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Dimensions, PixelRatio, StyleSheet, View } from 'react-native'

import AppPage from '../common/app-page'

import DayColumn from './day-column'
import HorizontalGrid from './horizontal-grid'
import MainGrid from './main-grid'
import NoData from './no-data'
import NoTemperature from './no-temperature'
import Tutorial from './tutorial'
import YAxis from './y-axis'

import { getCycleDaysSortedByDate } from '../../db'
import { getChartFlag, setChartFlag } from '../../local-storage'
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

const CycleChart = ({ navigation }) => {
  const [shouldShowHint, setShouldShowHint] = useState(true)

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

  const hideHint = () => {
    setShouldShowHint(false)
    setChartFlag()
  }

  const cycleDaysSortedByDate = getCycleDaysSortedByDate()

  const chartSymptoms = getSymptomsFromCycleDays(cycleDaysSortedByDate)
  const symptomRowSymptoms = chartSymptoms.filter(
    (symptom) => symptom !== 'temperature'
  )

  const shouldShowTemperatureColumn = chartSymptoms.indexOf('temperature') > -1

  const { width, height } = Dimensions.get('window')
  const numberOfColumnsToRender = Math.round(width / CHART_COLUMN_WIDTH)

  const xAxisHeight = height * 0.7 * CHART_XAXIS_HEIGHT_RATIO
  const remainingHeight = height * 0.7 - xAxisHeight
  const symptomHeight = PixelRatio.roundToNearestPixel(
    remainingHeight * CHART_SYMPTOM_HEIGHT_RATIO
  )
  const symptomRowHeight =
    PixelRatio.roundToNearestPixel(symptomRowSymptoms.length * symptomHeight) +
    CHART_GRID_LINE_HORIZONTAL_WIDTH
  const columnHeight = remainingHeight - symptomRowHeight

  const chartHeight = shouldShowTemperatureColumn
    ? height * 0.7
    : symptomRowHeight + xAxisHeight

  const columns = makeColumnInfo()

  const renderColumn = ({ item }) => {
    return (
      <DayColumn
        dateString={item}
        navigation={navigation}
        symptomHeight={symptomHeight}
        columnHeight={columnHeight}
        symptomRowSymptoms={symptomRowSymptoms}
        chartSymptoms={chartSymptoms}
        shouldShowTemperatureColumn={shouldShowTemperatureColumn}
        xAxisHeight={xAxisHeight}
      />
    )
  }

  const hasDataToDisplay = chartSymptoms.length > 0

  if (!hasDataToDisplay) {
    return <NoData />
  }

  return (
    <AppPage
      contentContainerStyle={styles.pageContainer}
      scrollViewStyle={styles.page}
    >
      <View style={styles.chartContainer}>
        {shouldShowHint && <Tutorial onClose={hideHint} />}
        {!shouldShowTemperatureColumn && <NoTemperature />}
        <View style={styles.chartArea}>
          <YAxis
            height={columnHeight}
            symptomsToDisplay={symptomRowSymptoms}
            symptomsSectionHeight={symptomRowHeight}
            shouldShowTemperatureColumn={shouldShowTemperatureColumn}
            xAxisHeight={xAxisHeight}
          />
          <MainGrid
            data={columns}
            renderItem={renderColumn}
            initialNumToRender={numberOfColumnsToRender}
            contentContainerStyle={{ height: chartHeight }}
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
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
