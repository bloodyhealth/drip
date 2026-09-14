import React, { ComponentType, ReactNode, useState } from 'react'

import ButtonJs from '../common/button'
import SegmentJs from '../common/segment'

// See error-view.tsx: the shared components are plain JS, so their props are
// re-typed here rather than inferred.
const Button = ButtonJs as ComponentType<{
  children?: ReactNode
  iconName?: string
  isCTA?: boolean
  isSmall?: boolean
  onPress?: () => void
  testID?: string
  style?: object
}>
const Segment = SegmentJs as ComponentType<{
  children?: ReactNode
  last?: boolean
  title?: string
}>

// Dev-only trigger for testing the error boundary. Throwing straight from
// onPress would not work: React error boundaries do not catch errors raised in
// event handlers, so the press flips state and the throw happens in render.
export const DebugCrashButton = () => {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) throw new Error('Debug crash triggered from settings')

  return (
    <Segment last>
      <Button onPress={() => setShouldThrow(true)}>Trigger test crash</Button>
    </Segment>
  )
}
