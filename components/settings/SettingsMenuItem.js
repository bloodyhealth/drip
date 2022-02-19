import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import AppIcon from '../common/app-icon'
import AppText from '../common/app-text'
import Segment from '../common/segment'

import { connect } from 'react-redux'
import { navigate } from '../../slices/navigation'

import { Colors, Containers, Sizes } from '../../styles'

const SettingsMenuItem = ({ item, last, navigate }) => {
  return (
    <Segment last={last}>
      <TouchableOpacity
        style={styles.container}
        key={item.title}
        onPress={() => navigate(item.component)}
      >
        <View>
          <AppText style={styles.title}>{item.title}</AppText>
          {!!item.text && <AppText>{item.text}</AppText>}
        </View>
        <AppIcon name="chevron-right" color={Colors.orange} />
      </TouchableOpacity>
    </Segment>
  )
}

SettingsMenuItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
  last: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    ...Containers.rowContainer,
  },
  title: {
    color: Colors.purple,
    fontSize: Sizes.subtitle,
  },
})

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (page) => dispatch(navigate(page)),
  }
}

export default connect(null, mapDispatchToProps)(SettingsMenuItem)
