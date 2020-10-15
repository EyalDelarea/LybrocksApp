import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import firestore from '@react-native-firebase/firestore';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import NewOrder from './NewOrder';
import HomeContainer from './Home/HomeContainer';
import ActiveOrderScreen from './ActiveOrders/ActiveOrderScreen';




const Tab = createMaterialBottomTabNavigator();

export default class RestaurantMain extends Component {
  constructor() {
    super();
    this.state = {
      fireDataBase: [],
      loading: false,
    };
    this.getFullFireDataBase = this.getFullFireDataBase.bind(this);
    this.calActiveOrdersLength = this.calActiveOrdersLength.bind(this);
    this.updateDB = this.updateDB.bind(this);
  }

  componentDidMount() {
    this.getFullFireDataBase();
  }

  /**
   * Requesting the firebase database from 'Orders' collection
   * filter (using .where) only delivery status 'on the way' and 'waiting for approval'
   * and then updates the state
   * @returns {Promise<void>}
   */
  getFullFireDataBase = async () => {
    await firestore()
      .collection('Orders')
      .where('status', 'in', ['Arrived'])
      .get()
      .catch((error) => console.log(' ERROR ' + error))
      .then((snapshot) =>
        this.setState({
          loading: false,
          fireDataBase: snapshot.docs,
        }),
      );

    console.log('DB has been fetched');
    this.calActiveOrdersLength();
  };

  updateDB() {
    this.getFullFireDataBase();
    console.log('DB has been update!');
  }
  calActiveOrdersLength = () => {
    let count = 0;
    const db = this.state.fireDataBase;

    for (let i = 0; i < db.length; i++) {
      if (
        db[i]._data.status === 'Arrived' ||
        db[i]._data.status === 'On The Way'
      ) {
        count++;
      }
    }
    return count;
  };

  render() {
    if (this.state.loading) {
      return (
        <>
          <Text>aa {this.state.fireDataBase}</Text>
          <ActivityIndicator size="large" color="#00ff00" />
        </>
      );
    } else {
      return (
        <NavigationContainer independent={true}>
          <Tab.Navigator
            activeColor="#f0edf6"
            inactiveColor="#3e2465"
            initialRouteName="Home">
            <Tab.Screen
              name={'Home'}
              children={() => <HomeContainer db={this.state.fireDataBase} />}
            />
            <Tab.Screen
              name={'New'}
              children={() => (
                <NewOrder
                  db={this.state.fireDataBase}
                  notifyDBChange={this.updateDB}
                />
              )}
            />
            <Tab.Screen
              name="ActiveOrders"
              children={() => (
                <ActiveOrderScreen db={this.state.fireDataBase} />
              )}
              options={{
                tabBarLabel: 'Active Orders',
                tabBarIcon: ({color, size}) => (
                  <MaterialCommunityIcons
                    name="alarm"
                    color={'black'}
                    size={25}
                  />
                ),
                tabBarBadge: this.calActiveOrdersLength(),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      );
    }
  }
}
