import React, { Component } from 'react'
import {
  TextInput,
  View,
  ScrollView
} from 'react-native'
import styles from '../../../styles'
import { saveSymptom } from '../../../db'
import { sex as labels } from '../labels/labels'
import ActionButtonFooter from './action-button-footer'
import SelectBoxGroup from '../select-box-group'
import SymptomSection from './symptom-section'

const sexBoxes = [{
  label: labels.solo,
  stateKey: 'solo'
}, {
  label: labels.partner,
  stateKey: 'partner'
}]

const contraceptiveBoxes = [{
  label: labels.condom,
  stateKey: 'condom'
}, {
  label: labels.pill,
  stateKey: 'pill'
}, {
  label: labels.iud,
  stateKey: 'iud'
}, {
  label: labels.patch,
  stateKey: 'patch'
}, {
  label: labels.ring,
  stateKey: 'ring'
}, {
  label: labels.implant,
  stateKey: 'implant'
}, {
  label: labels.diaphragm,
  stateKey: 'diaphragm'
}, {
  label: labels.none,
  stateKey: 'none'
}, {
  label: labels.other,
  stateKey: 'other'
}]

export default class Sex extends Component {
  constructor(props) {
    super(props)
    this.cycleDay = props.cycleDay
    this.state = {}
    if (this.cycleDay.sex !== null) {
      Object.assign(this.state, this.cycleDay.sex)
      // We make sure other is always true when there is a note,
      // e.g. when import is messed up.
      if (this.cycleDay.sex && this.cycleDay.sex.note) {
        this.state.other = true
      }
    }
  }

  toggleState = (key) => {
    const curr = this.state[key]
    this.setState({[key]: !curr})
    if (key === 'other' && !curr) {
      this.setState({focusTextArea: true})
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.page}>
          <SymptomSection
            header="Activity"
            explainer={labels.activityExplainer}
          >
            <SelectBoxGroup
              data={sexBoxes}
              onSelect={this.toggleState}
              optionsState={this.state}
            />
          </SymptomSection>
          <SymptomSection
            header="Contraceptives"
            explainer={labels.contraceptiveExplainer}
          >
            <SelectBoxGroup
              data={contraceptiveBoxes}
              onSelect={this.toggleState}
              optionsState={this.state}
            />
          </SymptomSection>

          {this.state.other &&
            <TextInput
              autoFocus={this.state.focusTextArea}
              multiline={true}
              placeholder="Enter"
              value={this.state.note}
              onChangeText={(val) => {
                this.setState({ note: val })
              }}
            />
          }
        </ScrollView>
        <ActionButtonFooter
          symptom='sex'
          cycleDay={this.cycleDay}
          saveAction={() => {
            const copyOfState = Object.assign({}, this.state)
            if (!copyOfState.other) {
              copyOfState.note = null
            }
            saveSymptom('sex', this.cycleDay, copyOfState)
          }}
          saveDisabled={Object.values(this.state).every(value => !value)}
          navigate={this.props.navigate}
        />
      </View>
    )
  }
}