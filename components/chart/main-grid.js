import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'

import LoadingMoreView from './loading-more'

const MainGrid = (props) => {
  const [endReached, setEndReached] = useState(false)

  // Log MainGrid render
  console.log('[MainGrid] Rendering', {
    timestamp: Date.now(),
    dataLength: props.data?.length,
    renderItemRef: props.renderItem?.toString?.().substring(0, 50),
    initialNumToRender: props.initialNumToRender,
    contentContainerStyle: props.contentContainerStyle,
  })

  return (
    <FlatList
      horizontal={true}
      inverted={true}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      windowSize={30}
      onEndReached={() => setEndReached(true)}
      ListFooterComponent={<LoadingMoreView end={endReached} />}
      updateCellsBatchingPeriod={800}
      {...props}
    />
  )
}

MainGrid.propTypes = {
  height: PropTypes.number,
  data: PropTypes.array,
  renderItem: PropTypes.func,
  initialNumToRender: PropTypes.number,
  contentContainerStyle: PropTypes.object,
}

export default MainGrid
