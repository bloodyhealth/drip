import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Header } from '@/components/header'
import Menu from '@/components/menu'

import { flushPendingNavigation, navigationRef } from './navigation-ref'
import { PageName, PageParams, ScreenLayoutProps } from './types'
import { viewsList } from './views'

const Stack = createNativeStackNavigator<PageParams>()

export const Navigation = () => (
  <NavigationContainer ref={navigationRef} onReady={flushPendingNavigation}>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, animation: 'none' }}
      screenLayout={renderScreenLayout}
    >
      {(Object.keys(viewsList) as PageName[]).map((name) => (
        <Stack.Screen key={name} name={name} component={viewsList[name]} />
      ))}
    </Stack.Navigator>
  </NavigationContainer>
)

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
