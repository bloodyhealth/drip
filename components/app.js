import React from 'react'
import 'react-native-gesture-handler'
import { StyleSheet, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './Home'
import Chart from './chart/chart'
import CalendarView from './calendar'
import CycleDayOverview from './cycle-day/cycle-day-overview'
import Stats from './stats'
import Icon from './common/menu-icon'
import Header from './header'

import { Colors, Fonts, Sizes } from '../styles'

const HomeStack = createStackNavigator()

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="CycleDayOverview" component={CycleDayOverview} />
    </HomeStack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: ({ navigation }) => <Header navigation={navigation} />,
          tabBarIcon: ({ focused }) => {
            let icon = 'chart'

            if (route.name === 'CalendarStackScreen') {
              icon = 'calendar'
            } else if (route.name === 'Stats') {
              icon = 'statistics'
            }

            return <Icon name={icon} isActive={focused} />
          },
          tabBarLabel: ({ color }) => {
            return (
              <Text style={[styles.text, { color: color }]}>{route.name}</Text>
            )
          },
          tabBarActiveTintColor: Colors.orange,
          tabBarInactiveTintColor: Colors.grey,
          tabBarStyle: { height: 80 },
        })}
      >
        <Tab.Screen
          name="HomeStackScreen"
          component={HomeStackScreen}
          options={{ tabBarButton: () => null, tabBarVisible: false }}
        />
        <Tab.Screen name="Calendar" component={CalendarView} />
        <Tab.Screen name="Chart" component={Chart} />
        <Tab.Screen name="Stats" component={Stats} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: Sizes.small,
    textTransform: 'uppercase',
  },
})

export default App
