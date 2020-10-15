import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Avatar} from 'react-native-elements';

import call from 'react-native-phone-call';

class Details extends Component {
  render() {
    const item = this.props.navigation.state.params.item._data;

    return (
      <>
        <View>
          <Text>Customer Name : {item.customerName[0]}</Text>
          <Text>Address : {item.address}</Text>
          <Text>Payment Method : {item.cash ? 'cash' : 'credit'}</Text>
          <Text>Notes : {item.notes[0]}</Text>
          <Text>Total Cost: {item.totalCost}₪</Text>
          <Text>Status: {item.status}</Text>
        </View>
        <View
          style={{
            marginTop: 30,
          }}>
          <Text>Delivery Info:</Text>
          <Text>Delivery guy : Not Assigned yet</Text>
          <Text>Order for {item.date}</Text>
          <Text>Eta</Text>
          <TouchableOpacity onPress={() => call({number: '0527475479'})}>
            <Icon name="phone" size={30} />
            <Text>Call me</Text>
          </TouchableOpacity>

          <Avatar
            size="xlarge"
            rounded
            source={{
              uri:
                'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            }}
            onPress={() => console.log('Works!')}
            activeOpacity={0.7}
          />
        </View>
      </>
    );
  }
}

export default Details;
