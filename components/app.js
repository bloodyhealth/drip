import React, { useState, useEffect } from 'react'
import { BackHandler, StyleSheet, View, Button } from 'react-native'
import PropTypes from 'prop-types'
import { LocalDate } from '@js-joda/core'

import Header from './header'
import Menu from './menu'
import { viewsList } from './views'
import { pages } from './pages'

import notifee, { EventType } from '@notifee/react-native'
import setupNotifications from '../lib/notifications/setup'
import { handleNotificationPress } from '../lib/notifications/utils'

import { closeDb } from '../db'

const App = ({ restartApp }) => {
  const [date, setDate] = useState(LocalDate.now().toString())
  const [currentPage, setCurrentPage] = useState('Home')
  const goBack = () => {
    if (currentPage === 'Home') {
      closeDb()
      BackHandler.exitApp()
    } else {
      const { parent } = pages.find((p) => p.component === currentPage)

      setCurrentPage(parent)
    }

    return true
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      goBack
    )
    return () => backHandler.remove()
  })

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotificationPress(detail, { setDate, setCurrentPage })
      }
    })

    // Background events does redirect to correst screen (missing to open the date in which to add the data)
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotificationPress(detail, { setDate, setCurrentPage })
      }
    })

    setupNotifications()

    return () => unsubscribe()
  }, [])

  const Page = viewsList[currentPage]
  const isTemperatureEditView = currentPage === 'TemperatureEditView'
  const headerProps = { navigate: setCurrentPage }
  const pageProps = {
    date,
    setDate,
    isTemperatureEditView,
    navigate: setCurrentPage,
  }

  return (
    <View style={styles.container}>
      <Header {...headerProps} />
      <Page {...pageProps} restartApp={restartApp} />
      <Menu currentPage={currentPage} navigate={setCurrentPage} />
    </View>
  )
}

App.propTypes = {
  restartApp: PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App
