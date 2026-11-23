import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import { AppText } from '../common/app-text'
import { Sizes, Spacing, Typography } from '../../styles'

const StatsOverview = ({ data }) => {
  return data.map((row, i) => <Row key={i} {...row} />)
}

StatsOverview.propTypes = {
  data: PropTypes.array.isRequired,
}

const Row = ({ value, label, hasAsterisk, hasCharacter }) => (
  <View style={styles.row}>
    <Cell content={value} isLeft hasCharacter={hasCharacter} />
    <Cell content={label} hasAsterisk={hasAsterisk} />
  </View>
)

Row.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  hasAsterisk: PropTypes.bool,
  hasCharacter: PropTypes.bool,
}

const Cell = ({ content, isLeft, hasAsterisk, hasCharacter }) => {
  const styleContainer = isLeft ? styles.cellLeft : styles.cellRight
  const styleText = isLeft ? styles.accentPurpleBig : styles.accentOrange
  const numberOfLines = isLeft ? 1 : 2
  const ellipsizeMode = isLeft ? 'clip' : 'tail'

  return (
    <View style={styleContainer}>
      <View style={styles.row}>
        {hasCharacter && <AppText style={styles.accentPurple}>±</AppText>}
        <AppText
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
          style={styleText}
        >
          {content}
          {hasAsterisk && <AppText style={styles.accentOrange}>*</AppText>}
        </AppText>
      </View>
    </View>
  )
}

Cell.propTypes = {
  content: PropTypes.node.isRequired,
  isLeft: PropTypes.bool,
  hasAsterisk: PropTypes.bool,
  hasCharacter: PropTypes.bool,
}

const styles = StyleSheet.create({
  accentOrange: {
    ...Typography.accentOrange,
    fontSize: Sizes.small,
    margin: Sizes.tiny,
  },
  accentPurple: {
    ...Typography.title,
    fontSize: Sizes.small,
    marginRight: Spacing.tiny,
  },
  accentPurpleBig: {
    ...Typography.accentPurpleBig,
    marginRight: Spacing.tiny,
  },
  cellLeft: {
    alignItems: 'flex-end',
    flex: 3,
    justifyContent: 'center',
  },
  cellRight: { flex: 5 },
  row: { flexDirection: 'row' },
})

export default StatsOverview
