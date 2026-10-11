import React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'

import { Containers, Colors } from '../../styles'

const AppLoadingView = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.orange} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Containers.centerItems,
  },
})

export default AppLoadingView
