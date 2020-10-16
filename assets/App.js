import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {Text} from 'react-native';
import RestaurantMain from './Restaurant/RestaurantMain';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      userAuth: false,
      userIsRestaurant: true,
      userIsCourier: false,
      userIsManger: false,
    };
  }
  render() {
    if (this.state.userAuth) {
      return <Text>Login</Text>;
    } else if (this.state.userIsRestaurant) {
      return (
        <>
          <RestaurantMain />
        </>
      );
    } else if (this.state.userIsCourier) {
      return <Text>cour</Text>;
    } else if (this.state.userIsManger) {
      return <Text>manger</Text>;
    }
  }
}
