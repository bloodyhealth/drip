import React, { useState } from 'react'

import { LearnMore } from './learn-more'
import { ModalWithInfo } from '@/components/modal/modal-with-info'
import { SymptomEditForm } from '@/components/cycle-day/symptom-edit-form'

import { blank, save, SymptomData } from '../helpers/cycle-day'
import { showToast } from '../helpers/general'

import { Symptom } from '@/config'
import { useTranslation } from 'react-i18next'

interface SymptomEditViewProps {
  date: string
  onClose: () => void
  symptom: Symptom
  symptomData?: SymptomData | null
}

export const SymptomEditView = ({
  date,
  onClose,
  symptom,
  symptomData,
}: SymptomEditViewProps) => {
  const { t } = useTranslation()
  const symptomLabel = t(`symptoms.${symptom}`)
  const symptomTitle =
    symptomLabel.charAt(0).toUpperCase() + symptomLabel.slice(1)
  const initialData = symptomData ?? blank[symptom]
  const [data, setData] = useState(initialData)

  const onRemove = () => {
    save[symptom](data, date, true)
    showToast(t('cycleDay.symptomEditModal.dataDeleted'))
    onClose()
  }

  const onSave = () => {
    const hasDataChanged = JSON.stringify(data) !== JSON.stringify(initialData)

    if (hasDataChanged) {
      save[symptom](data, date, false)
      showToast(t('cycleDay.symptomEditModal.dataSaved'))
    }

    onClose()
  }

  return (
    <ModalWithInfo
      infoContent={<LearnMore symptom={symptom} />}
      infoTitle={t('cycleDay.symptomEditModal.learnMore.symptomTitle', {
        symptom: symptomLabel,
      })}
      onClose={onSave}
      title={symptomTitle}
    >
      <SymptomEditForm
        data={data}
        onChange={setData}
        onRemove={onRemove}
        onSave={onSave}
        symptom={symptom}
      />
    </ModalWithInfo>
  )
}
