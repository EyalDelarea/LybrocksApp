import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import NewOrder from './NewOrder';
import HomeContainer from './Home/HomeContainer';
import ActiveOrderScreen from './ActiveOrders/ActiveOrderScreen';
import {fetchDatabase} from '../../redux/app-redux';
import {connect} from 'react-redux';
const Tab = createMaterialBottomTabNavigator();

class RestaurantMain extends Component {
  constructor(props) {
    super(props);

    this.calActiveOrdersLength = this.calActiveOrdersLength.bind(this);
    this.props.fetchDatabase();
    this.calActiveOrdersLength();
  }

  calActiveOrdersLength = () => {
    let count = 0;

    const db = this.props.fireDatabase._docs;
    if (db !== undefined) {
      for (let i = 0; i < db.length; i++) {

        if (
          db[i]._data.status === 'Waiting approval' ||
          db[i]._data.status === 'On the way'
        ) {
          count++;
        }
      }
    }
    return count;
  };

  render() {
    if (this.props.loading) {
      return (
        <>
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
            <Tab.Screen name={'Home'} children={() => <HomeContainer />} />
            <Tab.Screen name={'New'} children={() => <NewOrder />} />
            <Tab.Screen
              name="ActiveOrders"
              children={() => <ActiveOrderScreen />}
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

const mapStateToProps = (state) => {
  return {
    fireDatabase: state.fireDatabase,
    loading: state.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDatabase: () => {
      dispatch(fetchDatabase());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantMain);
