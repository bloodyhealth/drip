import React from 'react'

import { Navigation } from '@/context/navigation/navigation'
import { useNotifications } from '@/notifications/use-notifications'

const App = () => {
  useNotifications()

  return <Navigation />
}

export default App
