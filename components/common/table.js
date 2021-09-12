import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import AppText from './app-text'

import { Sizes, Spacing, Typography } from '../../styles'

const Table = ({ tableContent }) => {
  return tableContent.map((rowContent, i) => (
    <Row key={i} rowContent={rowContent} />
  ))
}

Table.propTypes = {
  tableContent: PropTypes.array.isRequired,
}

const Row = ({ rowContent }) => {
  return (
    <View style={styles.row}>
      <Cell content={rowContent[0]} isLeft />
      <Cell content={rowContent[1]} />
    </View>
  )
}

Row.propTypes = {
  rowContent: PropTypes.array.isRequired,
}

const Cell = ({ content, isLeft }) => {
  const styleContainer = isLeft ? styles.cellLeft : styles.cellRight
  const styleText = isLeft ? styles.accentPurpleBig : styles.accentOrange
  const numberOfLines = isLeft ? 1 : 2
  const ellipsizeMode = isLeft ? 'clip' : 'tail'

  return (
    <View style={styleContainer}>
      <AppText
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        style={styleText}
      >
        {content}
      </AppText>
    </View>
  )
}

Cell.propTypes = {
  content: PropTypes.node.isRequired,
  isLeft: PropTypes.bool,
}

const styles = StyleSheet.create({
  accentOrange: {
    ...Typography.accentOrange,
    fontSize: Sizes.small,
  },
  accentPurpleBig: {
    ...Typography.accentPurpleBig,
    marginRight: Spacing.small,
  },
  cellLeft: {
    alignItems: 'flex-end',
    flex: 5,
    justifyContent: 'center',
  },
  cellRight: {
    flex: 6,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.tiny,
  },
})

export default Table
