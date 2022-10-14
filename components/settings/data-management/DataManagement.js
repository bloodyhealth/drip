import React, { useState } from 'react'

import AppLoadingView from '../../common/app-loading'
import AppPage from '../../common/app-page'
import AppText from '../../common/app-text'
import Segment from '../../common/segment'

import DeleteData from './delete-data'

import labels from '../../../i18n/en/settings'
import ImportData from './ImportData'
import ExportData from './ExportData'

const DataManagement = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeletingData, setIsDeletingData] = useState(false)

  if (isLoading) return <AppLoadingView />

  return (
    <AppPage>
      <ExportData
        resetIsDeletingData={() => setIsDeletingData(false)}
        setIsLoading={setIsLoading}
      />
      <ImportData
        resetIsDeletingData={() => setIsDeletingData(false)}
        setIsLoading={setIsLoading}
      />
      <Segment title={labels.deleteSegment.title} last>
        <AppText>{labels.deleteSegment.explainer}</AppText>
        <DeleteData
          isDeletingData={isDeletingData}
          onStartDeletion={() => setIsDeletingData(true)}
        />
      </Segment>
    </AppPage>
  )
}

export default DataManagement
