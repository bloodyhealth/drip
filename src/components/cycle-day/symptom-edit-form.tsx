import React, { ComponentType } from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInputProps,
  View,
} from 'react-native'

import AppSwitchJs from '../common/app-switch'
import { AppText } from '../common/app-text'
import AppTextInputJs from '../common/app-text-input'
import Button from '../common/button'
import { Segment } from '../common/segment'
import SelectBoxGroupJs from './select-box-group'
import SelectTabGroupJs from './select-tab-group'
import TemperatureJs from './temperature'

import {
  getSymptomPage,
  shouldShow,
  SymptomData,
  TabGroup,
  TabOption,
} from '../helpers/cycle-day'

import { Symptom } from '../../config'
import { fertilityTrackingObservable } from '../../local-storage'
import { Containers, Sizes, Spacing } from '../../styles'
import { useTranslation } from 'react-i18next'

interface SymptomEditFormProps {
  data: SymptomData
  date: string
  onChange: (data: SymptomData) => void
  onRemove: () => void
  onSave: () => void
  symptom: Symptom
}

export const SymptomEditForm = ({
  data,
  date,
  onChange,
  onRemove,
  onSave,
  symptom,
}: SymptomEditFormProps) => {
  const { t } = useTranslation()
  const symptomConfig = getSymptomPage(t)[symptom]
  const getParsedData = (): SymptomData => JSON.parse(JSON.stringify(data))
  const isFertilityTrackingEnabled = fertilityTrackingObservable.value

  const onEditNote = (note: string) => {
    const parsedData = getParsedData()

    if (symptom === 'note') {
      Object.assign(parsedData, { value: note })
    } else {
      parsedData.note = note
    }

    onChange(parsedData)
  }

  const onExcludeToggle = () => {
    const parsedData = getParsedData()

    Object.assign(parsedData, { exclude: !parsedData.exclude })

    onChange(parsedData)
  }

  const onSaveTemperature = (value: string, field: string) => {
    const parsedData = getParsedData()
    const dataToSave =
      field === 'value' ? { [field]: Number(value) } : { [field]: value }

    Object.assign(parsedData, { ...dataToSave })

    onChange(parsedData)
  }

  const onSelectBox = (key: string) => {
    const parsedData = getParsedData()

    const newValue = data[key] === true ? null : true
    parsedData[key] = newValue

    if (key === 'other') {
      parsedData.note = null
    }

    onChange(parsedData)
  }

  const onSelectBoxNote = (value: string) => {
    const parsedData = getParsedData()

    Object.assign(parsedData, { note: value !== '' ? value : null })

    onChange(parsedData)
  }

  const onSelectTab = (group: TabGroup, value: number) => {
    const parsedData = getParsedData()

    parsedData[group.key] = parsedData[group.key] !== value ? value : null
    onChange(parsedData)
  }
  const noteText = symptom === 'note' ? data.value : data.note
  const noteValue = typeof noteText === 'string' ? noteText : ''
  // show exclude switch for bleeding, mucus, cervix, temperature
  // but if fertility tracking is off only for bleeding
  const isExcludeSwitchVisible =
    shouldShow(symptomConfig.excludeText) &&
    (symptom === 'bleeding' || isFertilityTrackingEnabled)
  const inputProps: TextInputProps = {
    multiline: true,
    numberOfLines: Platform.OS === 'ios' ? undefined : 4, // only Android
    style: symptom === 'note' ? null : styles.input,
    scrollEnabled: true,
    textAlignVertical: 'top',
  }

  return (
    <ScrollView keyboardDismissMode="on-drag">
      {symptom === 'temperature' && (
        <Temperature
          data={data}
          date={date}
          save={(value, field) => onSaveTemperature(value, field)}
        />
      )}
      {symptomConfig.selectTabGroups?.map((group) => {
        return (
          <Segment key={group.key}>
            <AppText style={styles.title}>{group.title}</AppText>
            <SelectTabGroup
              activeButton={data[group.key]}
              buttons={group.options}
              onSelect={(value) => onSelectTab(group, value)}
            />
          </Segment>
        )
      })}
      {symptomConfig.selectBoxGroups?.map((group) => {
        const isOtherSelected =
          data.other !== null &&
          data.other !== false &&
          Object.keys(group.options).includes('other')

        return (
          <Segment key={group.key}>
            <AppText style={styles.title}>{group.title}</AppText>
            <SelectBoxGroup
              labels={group.options}
              onSelect={(value) => onSelectBox(value)}
              optionsState={data}
            />
            {isOtherSelected && (
              <AppTextInput
                {...inputProps}
                placeholder={t('cycleDay.symptomEditModal.enter')}
                value={data.note ?? ''}
                onChangeText={(value) => onSelectBoxNote(value)}
              />
            )}
          </Segment>
        )
      })}
      {isExcludeSwitchVisible && (
        <Segment>
          <AppSwitch
            onToggle={onExcludeToggle}
            text={symptomConfig.excludeText ?? ''}
            value={data.exclude}
          />
        </Segment>
      )}
      {shouldShow(symptomConfig.note) && (
        <Segment>
          <AppText>{symptomConfig.note}</AppText>
          <AppTextInput
            {...inputProps}
            onChangeText={onEditNote}
            placeholder={t('cycleDay.symptomEditModal.enter')}
            testID="noteInput"
            value={noteValue}
          />
        </Segment>
      )}
      <View style={styles.buttonsContainer}>
        <Button variant="secondary" onPress={onRemove}>
          {t('cycleDay.symptomEditModal.remove')}
        </Button>
        <Button onPress={onSave}>{t('cycleDay.symptomEditModal.save')}</Button>
      </View>
    </ScrollView>
  )
}

const AppSwitch = AppSwitchJs as ComponentType<{
  onToggle: () => void
  text: string
  value?: boolean
}>
const AppTextInput = AppTextInputJs as ComponentType<TextInputProps>
const SelectBoxGroup = SelectBoxGroupJs as ComponentType<{
  labels: Record<string, string>
  onSelect: (key: string) => void
  optionsState: SymptomData
}>
const SelectTabGroup = SelectTabGroupJs as ComponentType<{
  activeButton: unknown
  buttons: TabOption[]
  onSelect: (value: number) => void
}>
const Temperature = TemperatureJs as ComponentType<{
  data: SymptomData
  date: string
  save: (value: string, field: string) => void
}>

const styles = StyleSheet.create({
  buttonsContainer: {
    ...Containers.rowContainer,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
  },
  input: {
    height: Sizes.base * 5,
  },
  title: {
    fontSize: Sizes.subtitle,
  },
})
