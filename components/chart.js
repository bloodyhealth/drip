import React, { Component } from 'react'
import { FlatList } from 'react-native'
import range from 'date-range'
import Svg,{
  G,
  Rect,
  Text,
  Circle,
  Line
} from 'react-native-svg'
import { LocalDate } from 'js-joda'
import { getCycleDay, getOrCreateCycleDay, cycleDaysSortedByDate } from '../db'
import getCycleDayNumberModule from '../get-cycle-day-number'

const getCycleDayNumber = getCycleDayNumberModule()

const chartLength = 350
const columnWidth = 30
const middle = columnWidth / 2
const xAxis = {
  top: chartLength - 15,
  margin: 3
}
const dateRowY = xAxis.top - xAxis.margin
const cycleDayNumberRowY = chartLength - xAxis.margin

const temperatureScale = {
  low: 33,
  high: 40
}
const cycleDaysToShow = 40
const dotRadius = 4
const curveColor = 'darkblue'

export default class CycleChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: makeColumnInfo(cycleDaysToShow)
    }

    this.recalculateChartInfo = (function(Chart) {
      return function() {
        Chart.setState({columns: makeColumnInfo(cycleDaysToShow)})
      }
    })(this)

    cycleDaysSortedByDate.addListener(this.recalculateChartInfo)
  }

  componentWillUnmount() {
    cycleDaysSortedByDate.removeListener(this.recalculateChartInfo)
  }

  passDateToDayView(dateString) {
    const cycleDay = getOrCreateCycleDay(dateString)
    this.props.navigation.navigate('cycleDay', { cycleDay })
  }

  makeDayColumn({ dateString, cycleDay, y }, index) {
    const cycleDayNumber = getCycleDayNumber(dateString)
    const labelProps = {
      stroke: "grey",
      fontSize: "10",
      x: 0,
    }

    const dateLabel = dateString.split('-').slice(1).join('-')

    return (
      <G key={dateString} onPress={() => this.passDateToDayView(dateString)}>
        <Rect
          x={0}
          y={0}
          width={columnWidth}
          height={chartLength}
          fill="lightgrey"
          strokeWidth="1"
          stroke="grey"
        />
        <Text {...labelProps} y={cycleDayNumberRowY}>{cycleDayNumber}</Text>
        <Text {...labelProps} y={dateRowY}>{dateLabel}</Text>

        {cycleDay && cycleDay.bleeding ? <Circle cx={middle} cy="50" r="7" fill="red" /> : null}

        {y ? this.drawDotAndLine(y, index) : null}
      </G>
    )
  }

  drawDotAndLine(currY, index) {
    let lineToRight
    let lineToLeft
    const cols = this.state.columns

    function makeLine(otherColY, x) {
      const middleY = ((otherColY - currY) / 2) + currY
      const rightTarget = [x, middleY]
      return <Line
        x1={middle}
        y1={currY}
        x2={rightTarget[0]}
        y2={rightTarget[1]}
        stroke={'lightseagreen'}
        strokeWidth={2}
      />
    }

    const thereIsADotToTheRight = index > 0 && cols[index - 1].y
    const thereIsADotToTheLeft = index < cols.length - 1 && cols[index + 1].y

    if (thereIsADotToTheRight) {
      lineToRight = makeLine(cols[index - 1].y, columnWidth)
    }
    if (thereIsADotToTheLeft) {
      lineToLeft = makeLine(cols[index + 1].y, 0)
    }

    return (<G>
      <Circle
        cx={middle}
        cy={currY}
        r={dotRadius}
        fill={curveColor}
      />
      {lineToRight}
      {lineToLeft}
    </G>)
  }

  render() {
    return (
      <FlatList
        horizontal={true}
        inverted={true}
        data={this.state.columns}
        renderItem={({item, index}) => {
          return (
            <Svg width={columnWidth} height={chartLength}>
              {this.makeDayColumn(item, index)}
            </Svg>
          )
        }}
        keyExtractor={item => item.label}
      >
      </FlatList>
    )
  }
}

function makeColumnInfo(n) {
  const xAxisDates = getPreviousDays(n).map(jsDate => {
    return LocalDate.of(
      jsDate.getFullYear(),
      jsDate.getMonth() + 1,
      jsDate.getDate()
    ).toString()
  })

  return xAxisDates.map(dateString => {
    const cycleDay = getCycleDay(dateString)
    const temp = cycleDay && cycleDay.temperature && cycleDay.temperature.value
    return {
      dateString,
      cycleDay,
      y: temp ? normalizeToScale(temp) : null
    }
  })
}

function getPreviousDays(n) {
  const today = new Date()
  today.setHours(0); today.setMinutes(0); today.setSeconds(0); today.setMilliseconds(0)
  const twoWeeksAgo = new Date(today - (range.DAY * n))

  return range(twoWeeksAgo, today).reverse()
}

function normalizeToScale(temp) {
  const valueRelativeToScale = (temperatureScale.high - temp) / (temperatureScale.high - temperatureScale.low)
  const scaleHeight = chartLength
  return scaleHeight * valueRelativeToScale
}