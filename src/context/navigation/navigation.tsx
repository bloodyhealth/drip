import React, { useEffect } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Header from '@/components/header'
import Menu from '@/components/menu'

import { flushPendingNavigation, navigationRef } from './navigation-ref'
import {
  NavigationProps,
  PageName,
  PageParams,
  ScreenLayoutProps,
} from './types'
import { viewsList } from './views'

const Stack = createNativeStackNavigator<PageParams>()

export const Navigation = ({ screens = viewsList }: NavigationProps) => {
  useExitOnBackFromHome()

  return (
    <NavigationContainer ref={navigationRef} onReady={flushPendingNavigation}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false, animation: 'none' }}
        screenLayout={renderScreenLayout}
      >
        {(Object.keys(screens) as PageName[]).map((name) => (
          <Stack.Screen key={name} name={name} component={screens[name]} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

/**
 * The stack handles hardware back until only Home is left. Then the db is
 * closed and the app exits, so an encrypted db asks for the password again.
 */
const useExitOnBackFromHome = (): void => {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigationRef.canGoBack()) return false

        BackHandler.exitApp()
        return true
      }
    )

    return () => subscription.remove()
  }, [])
}

const renderScreenLayout = ({ children, route }: ScreenLayoutProps) => (
  <View style={styles.container}>
    <Header />
    {children}
    <Menu currentPage={route.name} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
