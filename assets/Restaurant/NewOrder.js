import React, {Component} from 'react';
import moment from 'moment';
import {
  Input,
  Button,
  ButtonGroup,
  CheckBox,
  Card,
} from 'react-native-elements';

import {Text, StyleSheet, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {fetchDatabase} from '../../redux/app-redux';
class NewOrder extends Component {
  constructor() {
    super();
    this.state = {
      customerName: '',
      address: '',
      notes: '',
      totalCost: '',
      etaSelected: '',
      credit: false,
      cash: false,
      selectedIndex: 5,
    };

    this.updateIndex = this.updateIndex.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.setValue = this.setValue.bind(this);
    this.checkBoxState = this.checkBoxState.bind(this);
    this.dateToArray = this.dateToArray.bind(this);
  }

  updateIndex(selectedIndex) {
    //set state for UI coloring
    this.setState({selectedIndex: selectedIndex});
    //set state for form information
    switch (selectedIndex) {
      case 0:
        this.setState({etaSelected: 10});
        break;
      case 1:
        this.setState({etaSelected: 20});
        break;
      case 2:
        this.setState({etaSelected: 30});
        break;
    }
  }

  /**
   * Dynamic function to store state attribute
   * @param attribute to set
   * @param value to change
   */
  setValue(attribute, value) {
    this.setState({
      [attribute]: [value],
    });
  }

  /**
   * Change check box state and makes sure that both checkboxes won't be true
   * @param attribute
   */
  checkBoxState(attribute) {
    if (attribute === 'cash') {
      this.setState({
        cash: !this.state.cash,
        credit: false,
      });
    } else {
      this.setState({
        credit: !this.state.credit,
        cash: false,
      });
    }
  }

  dateToArray() {
    return [
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds(),
    ];
  }

  /**
   * Submits the form and clear the screen
   */
  submitForm() {
    //TODO move to redux action
    firestore()
      .collection('Orders')
      .add({
        customerName: this.state.customerName,
        address: this.state.address,
        notes: this.state.notes,
        totalCost: this.state.totalCost,
        etaSelected: this.state.etaSelected,
        credit: this.state.credit,
        cash: this.state.cash,
        status: 'Waiting approval',
        date: this.dateToArray(),
        readableDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
      })
      // eslint-disable-next-line no-alert
      .then(alert('Order has been added!'));

    //Clear fields attributes
    this.setState({
      customerName: '',
      address: '',
      notes: '',
      totalCost: '',
      etaSelected: '',
      credit: false,
      cash: false,
      selectedIndex: '',
    });
  }

  render() {
    //define buttons for ETA
    const buttons = ['10 min', '20 min', '30 min'];
    const selectedIndex = this.state.selectedIndex;

    return (
      <>
        <Card>
          <Card.Title>New Order</Card.Title>
          <Card.Divider />
          <Input
            placeholder="Customer Name"
            value={this.state.customerName}
            rightIcon={{type: 'font-awesome', name: 'user'}}
            onChangeText={(text) => this.setValue('customerName', text)}
          />

          <Input
            placeholder="Address"
            value={this.state.address}
            rightIcon={{type: 'font-awesome', name: 'pencil'}}
            onChangeText={(text) => this.setValue('address', text)}
          />

          <Input
            placeholder="Notes"
            value={this.state.notes}
            rightIcon={{type: 'font-awesome', name: 'comments'}}
            onChangeText={(text) => this.setValue('notes', text)}
          />

          <Input
            placeholder="Total Cost"
            value={this.state.totalCost}
            rightIcon={{type: 'font-awesome', name: 'dollar'}}
            style={styles}
            onChangeText={(text) => this.setValue('totalCost', text)}
          />

          <View style={styles.row}>
            <Text style={styles.text}>ETA</Text>
          </View>

          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
          />
          <View style={styles.row}>
            <Text>Payment Method</Text>
          </View>

          <View style={styles.row}>
            <CheckBox
              left
              title="Credit"
              checked={this.state.credit}
              onPress={() => this.checkBoxState('credit')}
            />
            <CheckBox
              title="Cash"
              checked={this.state.cash}
              on
              onPress={() => this.checkBoxState('cash')}
            />
          </View>
          <Button onPress={this.submitForm} title="Send" />
        </Card>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 10,
  },
  text: {
    justifyContent: 'center',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default NewOrder;
