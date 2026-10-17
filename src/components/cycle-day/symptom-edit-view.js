import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import AppModal from '../common/app-modal'
import AppSwitch from '../common/app-switch'
import AppText from '../common/app-text'
import AppTextInput from '../common/app-text-input'
import Button from '../common/button'
import Segment from '../common/segment'
import SelectBoxGroup from './select-box-group'
import SelectTabGroup from './select-tab-group'
import Temperature from './temperature'

import { blank, getSymptomPage, save, shouldShow } from '../helpers/cycle-day'
import { showToast } from '../helpers/general'

import { fertilityTrackingObservable } from '../../local-storage'
import { Colors, Containers, Sizes, Spacing } from '../../styles'
import { useTranslation } from 'react-i18next'
import { LearnMore } from './learn-more'

const SymptomEditView = ({ date, onClose, symptom, symptomData }) => {
  const { t } = useTranslation()
  const symptomConfig = getSymptomPage(t)[symptom]
  const [data, setData] = useState(symptomData ? symptomData : blank[symptom])
  const [shouldShowInfo, setShouldShowInfo] = useState(false)
  const scrollViewRef = useRef(null)
  const shouldScrollToInfo = useRef(false)
  const learnMoreButtonY = useRef(0)
  const getParsedData = () => JSON.parse(JSON.stringify(data))
  const isFertilityTrackingEnabled = fertilityTrackingObservable.value

  const onPressLearnMore = () => {
    // only scroll when opening, not when collapsing
    shouldScrollToInfo.current = !shouldShowInfo
    setShouldShowInfo(!shouldShowInfo)
  }

  const onLearnMoreLayout = ({ nativeEvent }) => {
    learnMoreButtonY.current = nativeEvent.layout.y
  }

  // fires once the revealed text has been laid out, so it can be scrolled to
  const onInfoLayout = () => {
    if (!shouldScrollToInfo.current) return

    shouldScrollToInfo.current = false
    scrollViewRef.current?.scrollTo({
      y: learnMoreButtonY.current - Spacing.small,
      animated: true,
    })
  }

  const onEditNote = (note) => {
    const parsedData = getParsedData()

    if (symptom === 'note') {
      Object.assign(parsedData, { value: note })
    } else {
      parsedData.note = note
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
    showToast(t('cycleDay.symptomEditModal.dataDeleted'))
    onClose()
  }

  const hasDataChanged = () => {
    const initialData = symptomData ? symptomData : blank[symptom]

    return JSON.stringify(data) !== JSON.stringify(initialData)
  }

  const onRequestClose = () => {
    if (!hasDataChanged()) return onClose()

    Alert.alert(
      t('cycleDay.symptomEditModal.discardDialog.title'),
      t('cycleDay.symptomEditModal.discardDialog.text'),
      [
        {
          text: t('cycleDay.symptomEditModal.discardDialog.keepEditing'),
          style: 'cancel',
        },
        {
          text: t('cycleDay.symptomEditModal.discardDialog.discard'),
          style: 'destructive',
          onPress: onClose,
        },
      ]
    )
  }

  const onSave = () => {
    if (hasDataChanged()) {
      save[symptom](data, date, false)
      showToast(t('cycleDay.symptomEditModal.dataSaved'))
    }

    onClose()
  }

  const onSaveTemperature = (value, field) => {
    const parsedData = getParsedData()
    const dataToSave =
      field === 'value'
        ? { [field]: value === '' ? null : Number(value) }
        : { [field]: value }

    Object.assign(parsedData, { ...dataToSave })

    setData(parsedData)
  }

  const onSelectBox = (key) => {
    const parsedData = getParsedData()

    const newValue = data[key] === true ? null : true
    parsedData[key] = newValue

    if (key === 'other') {
      parsedData.note = null
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
    numberOfLines: Platform.OS === 'ios' ? null : 4, // only Android
    minHeight: Platform.OS === 'ios' ? styles.input.height : null,
    maxHeight:
      Platform.OS === 'ios' ? Dimensions.get('window').height * 0.4 : null,
    style: symptom === 'note' ? null : styles.input, // overwrites previous 2 lines to fix note space in symptoms
    scrollEnabled: true,
    textAlignVertical: 'top',
  }

  return (
    <AppModal onClose={onRequestClose}>
      <ScrollView
        contentContainerStyle={styles.modalContainer}
        keyboardDismissMode="on-drag"
        ref={scrollViewRef}
        style={styles.scrollView}
      >
        {symptom === 'temperature' && (
          <Temperature
            data={data}
            save={(value, field) => onSaveTemperature(value, field)}
          />
        )}
        {shouldShow(symptomConfig.selectTabGroups) &&
          symptomConfig.selectTabGroups.map((group) => {
            return (
              <Segment key={group.key} style={styles.segmentBorder}>
                <AppText style={styles.title}>{group.title}</AppText>
                <SelectTabGroup
                  activeButton={data[group.key]}
                  buttons={group.options}
                  onSelect={(value) => onSelectTab(group, value)}
                />
              </Segment>
            )
          })}
        {shouldShow(symptomConfig.selectBoxGroups) &&
          symptomConfig.selectBoxGroups.map((group) => {
            const isOtherSelected =
              data.other !== null &&
              data.other !== false &&
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
                    placeholder={t('cycleDay.symptomEditModal.enter')}
                    value={data.note}
                    onChangeText={(value) => onSelectBoxNote(value)}
                  />
                )}
              </Segment>
            )
          })}
        {/* show exclude AppSwitch for bleeding, mucus, cervix, temperature */}
        {/* but if fertility is off only for bleeding */}
        {shouldShow(symptomConfig.excludeText) &&
          (symptom === 'bleeding' || isFertilityTrackingEnabled) && (
            <Segment style={styles.segmentBorder}>
              <AppSwitch
                onToggle={onExcludeToggle}
                text={symptomConfig.excludeText}
                value={data.exclude}
              />
            </Segment>
          )}
        {shouldShow(symptomConfig.note) && (
          <Segment style={styles.segmentBorder}>
            <AppText>{symptomConfig.note}</AppText>
            <AppTextInput
              {...inputProps}
              onChangeText={onEditNote}
              placeholder={t('cycleDay.symptomEditModal.enter')}
              testID="noteInput"
              value={noteText !== null ? noteText : ''}
            />
          </Segment>
        )}
        <Button
          iconName={iconName}
          isSmall
          onLayout={onLearnMoreLayout}
          onPress={onPressLearnMore}
        >
          {t('cycleDay.symptomEditModal.learnMore.title')}
        </Button>
        {shouldShowInfo && (
          <View onLayout={onInfoLayout}>
            <Segment last style={styles.segmentBorder}>
              <LearnMore symptom={symptom} />
            </Segment>
          </View>
        )}
      </ScrollView>
      <View style={styles.modalContainer}>
        <View style={styles.buttonsContainer}>
          <Button isSmall onPress={onRemove}>
            {t('cycleDay.symptomEditModal.remove')}
          </Button>
          <Button isCTA isSmall onPress={onSave}>
            {t('cycleDay.symptomEditModal.save')}
          </Button>
        </View>
      </View>
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
  },
  input: {
    height: Sizes.base * 5,
  },
  modalContainer: {
    paddingHorizontal: Spacing.base,
  },
  scrollView: {
    flexShrink: 1,
  },
  segmentBorder: {
    borderBottomColor: Colors.greyLight,
  },
  title: {
    fontSize: Sizes.subtitle,
  },
})

export default SymptomEditView
