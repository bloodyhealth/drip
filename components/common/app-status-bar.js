import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SystemBars } from 'react-native-edge-to-edge'

import { Colors } from '../../styles'

const AppStatusBar = () => (
  <View style={styles.statusBar}>
    <SystemBars
      backgroundColor={Colors.purple}
      barStyle="light-content"
      translucent
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    backgroundColor: Colors.purple,
  },
})

export default AppStatusBar
