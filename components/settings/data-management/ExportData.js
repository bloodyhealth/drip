import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { getCycleDaysSortedByDate, mapRealmObjToJsObj } from '../../../db'
import getDataAsCsvDataUri from '../../../lib/import-export/export-to-csv'
import alertError from '../common/alert-error'
import { EXPORT_FILE_NAME } from './constants'
import RNFS from 'react-native-fs'
import { useTranslation } from 'react-i18next'

import AppText from '../../common/app-text'
import Button from '../../common/button'
import Segment from '../../common/segment'
import Share from 'react-native-share'

export default function ExportData({
  setIsLoading,
  closePasswordConfirmation,
}) {
  const { t } = useTranslation(null, {
    keyPrefix: 'sideMenu.settings.data.export',
  })

  async function startExport() {
    closePasswordConfirmation()
    setIsLoading(true)
    exportData()
    setIsLoading(false)
  }

  async function exportData() {
    try {
      const data = loadDataFromDb()
      const csvData = convertDataToCsv(data)
      await shareData(csvData)
    } catch (error) {
      alertError(error.message)
    }
  }

  function loadDataFromDb() {
    const cycleDaysByDate = mapRealmObjToJsObj(getCycleDaysSortedByDate())
    const hasNoData = cycleDaysByDate.length === 0
    if (hasNoData) {
      throw new Error(t('error.noData'))
    }
    return cycleDaysByDate
  }

  function convertDataToCsv(cycleDaysByDate) {
    try {
      return getDataAsCsvDataUri(cycleDaysByDate)
    } catch (err) {
      throw new Error(t('error.conversionFailed'))
    }
  }

  async function shareData(data) {
    try {
      const dateString = moment().format('YYYY-MM-DD')
      const fileName = `${EXPORT_FILE_NAME}-${dateString}.csv`
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`
      await RNFS.writeFile(path, data)

      await Share.open({
        title: t('title'),
        url: `file://${path}`,
        subject: t('title'),
        type: 'text/csv',
        showAppsToView: true,
        failOnCancel: false,
      })
    } catch (err) {
      throw new Error(t('error.sharingFailed'))
    }
  }

  return (
    <Segment title={t('button')}>
      <AppText>{t('text')}</AppText>
      <Button isCTA onPress={startExport}>
        {t('button')}
      </Button>
    </Segment>
  )
}

ExportData.propTypes = {
  closePasswordConfirmation: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
}
