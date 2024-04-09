import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, StyleSheet, View } from 'react-native'

import AppModal from '../common/app-modal'
import AppSwitch from '../common/app-switch'
import AppText from '../common/app-text'
import AppTextInput from '../common/app-text-input'
import Button from '../common/button'
import Segment from '../common/segment'
import SelectBoxGroup from './select-box-group'
import SelectTabGroup from './select-tab-group'
import Temperature from './temperature'

import { blank, save, shouldShow, symptomPage } from '../helpers/cycle-day'
import { showToast } from '../helpers/general'

import { fertilityTrackingObservable } from '../../local-storage'
import { shared as sharedLabels } from '../../i18n/en/labels'
import info from '../../i18n/en/symptom-info'
import { Colors, Containers, Sizes, Spacing } from '../../styles'

const SymptomEditView = ({ date, onClose, symptom, symptomData }) => {
  const symptomConfig = symptomPage[symptom]
  const [data, setData] = useState(symptomData ? symptomData : blank[symptom])
  const [shouldShowInfo, setShouldShowInfo] = useState(false)
  const isBleeding = symptom === 'bleeding'
  const getParsedData = () => JSON.parse(JSON.stringify(data))
  const onPressLearnMore = () => setShouldShowInfo(!shouldShowInfo)
  const isFertilityTrackingEnabled = fertilityTrackingObservable.value

  const onEditNote = (note) => {
    const parsedData = getParsedData()

    if (symptom === 'note') {
      Object.assign(parsedData, { value: note })
    } else {
      parsedData['note'] = note
    }

    setData(parsedData)
  }

  const onExcludeToggle = () => {
    const parsedData = getParsedData()

    Object.assign(parsedData, { exclude: !parsedData.exclude })

    setData(parsedData)
  }

  const onRemove = () => {
    save[symptom](data, date, true)
    showToast(sharedLabels.dataDeleted)
    onClose()
  }

  const onSave = () => {
    const hasDataChanged = () => {
      const initialData = symptomData ? symptomData : blank[symptom]

      return JSON.stringify(data) !== JSON.stringify(initialData)
    }

    if (hasDataChanged()) {
      save[symptom](data, date, false)
      showToast(sharedLabels.dataSaved)
    }

    onClose()
  }

  const onSaveTemperature = (value, field) => {
    const parsedData = getParsedData()
    const dataToSave =
      field === 'value' ? { [field]: Number(value) } : { [field]: value }

    Object.assign(parsedData, { ...dataToSave })

    setData(parsedData)
  }

  const onSelectBox = (key) => {
    const parsedData = getParsedData()
    if (key === 'other') {
      Object.assign(parsedData, {
        note: null,
        [key]: !data[key],
      })
    } else {
      Object.assign(parsedData, { [key]: !data[key] })
    }

    setData(parsedData)
  }

  const onSelectBoxNote = (value) => {
    const parsedData = getParsedData()

    Object.assign(parsedData, { note: value !== '' ? value : null })

    setData(parsedData)
  }

  const onSelectTab = (group, value) => {
    const parsedData = getParsedData()

    parsedData[group.key] = parsedData[group.key] !== value ? value : null
    setData(parsedData)
  }
  const iconName = shouldShowInfo ? 'chevron-up' : 'chevron-down'
  const noteText = symptom === 'note' ? data.value : data.note
  const inputProps = {
    multiline: true,
    numberOfLines: 3,
    scrollEnabled: false,
    style: styles.input,
    textAlignVertical: 'top',
  }

  {
    /* show exclude AppSwitch for bleeding, mucus, cervix, temperature */
  }
  {
    /* but if fertility is off only for bleeding */
  }
  const excludeToggle = shouldShow(symptomConfig.excludeText) &&
    (isBleeding || isFertilityTrackingEnabled) && (
      <Segment style={styles.segmentBorder}>
        <AppSwitch
          onToggle={onExcludeToggle}
          text={symptomPage[symptom].excludeText}
          value={data.exclude}
        />
      </Segment>
    )

  return (
    <AppModal onClose={onSave}>
      <ScrollView
        contentContainerStyle={styles.modalContainer}
        keyboardDismissMode="on-drag"
      >
        {symptom === 'temperature' && (
          <Temperature
            date={date}
            data={data}
            save={(value, field) => onSaveTemperature(value, field)}
          />
        )}

        {/* There should not be a line between the bleeding tab group and the exclude toggle */}
        {shouldShow(symptomConfig.selectTabGroups) &&
          symptomPage[symptom].selectTabGroups.map((group) => {
            return (
              <Segment
                key={group.key}
                style={styles.segmentBorder}
                last={isBleeding}
              >
                <AppText style={styles.title}>{group.title}</AppText>
                <SelectTabGroup
                  activeButton={data[group.key]}
                  buttons={group.options}
                  onSelect={(value) => onSelectTab(group, value)}
                />
              </Segment>
            )
          })}

        {/*for bleeding, we want to move the "exclude" toggle up between the tab and box groups, all other symptoms should still have it at the bottom*/}
        {isBleeding && excludeToggle}

        {shouldShow(symptomConfig.selectBoxGroups) &&
          symptomPage[symptom].selectBoxGroups.map((group) => {
            const isOtherSelected =
              data['other'] !== null &&
              data['other'] !== false &&
              Object.keys(group.options).includes('other')

            return (
              <Segment key={group.key} style={styles.segmentBorder}>
                <AppText style={styles.title}>{group.title}</AppText>
                <SelectBoxGroup
                  labels={group.options}
                  onSelect={(value) => onSelectBox(value)}
                  optionsState={data}
                />
                {isOtherSelected && (
                  <AppTextInput
                    {...inputProps}
                    placeholder={sharedLabels.enter}
                    value={data.note}
                    onChangeText={(value) => onSelectBoxNote(value)}
                  />
                )}
              </Segment>
            )
          })}

        {!isBleeding && excludeToggle}

        {shouldShow(symptomConfig.note) && (
          <Segment style={styles.segmentBorder}>
            <AppText>{symptomPage[symptom].note}</AppText>
            <AppTextInput
              {...inputProps}
              onChangeText={onEditNote}
              placeholder={sharedLabels.enter}
              testID="noteInput"
              value={noteText !== null ? noteText : ''}
            />
          </Segment>
        )}
        <View style={styles.buttonsContainer}>
          <Button iconName={iconName} isSmall onPress={onPressLearnMore}>
            {sharedLabels.learnMore}
          </Button>
          <Button isSmall onPress={onRemove}>
            {sharedLabels.remove}
          </Button>
          <Button isCTA isSmall onPress={onSave}>
            {sharedLabels.save}
          </Button>
        </View>
        {shouldShowInfo && (
          <Segment last style={styles.segmentBorder}>
            <AppText>{info[symptom].text}</AppText>
          </Segment>
        )}
      </ScrollView>
    </AppModal>
  )
}

SymptomEditView.propTypes = {
  date: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  symptom: PropTypes.string.isRequired,
  symptomData: PropTypes.object,
}

const styles = StyleSheet.create({
  buttonsContainer: {
    ...Containers.rowContainer,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  input: {
    height: Sizes.base * 5,
  },
  modalContainer: {
    paddingHorizontal: Spacing.base,
  },
  segmentBorder: {
    borderBottomColor: Colors.greyLight,
  },
  title: {
    fontSize: Sizes.subtitle,
  },
})

export default SymptomEditView
