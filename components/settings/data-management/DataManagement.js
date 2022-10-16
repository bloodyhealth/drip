import React, { useState } from 'react'

import AppLoadingView from '../../common/app-loading'
import AppPage from '../../common/app-page'

import DeleteData from './delete-data'
import ImportData from './ImportData'
import ExportData from './ExportData'

const DataManagement = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeletingData, setIsDeletingData] = useState(false)

  const resetIsDeletingData = () => setIsDeletingData(false)

  if (isLoading) return <AppLoadingView />

  return (
    <AppPage>
      <ExportData
        resetIsDeletingData={resetIsDeletingData}
        setIsLoading={setIsLoading}
      />
      <ImportData
        resetIsDeletingData={resetIsDeletingData}
        setIsLoading={setIsLoading}
      />
      <DeleteData
        isDeletingData={isDeletingData}
        onStartDeletion={() => setIsDeletingData(true)}
      />
    </AppPage>
  )
}

export default DataManagement
