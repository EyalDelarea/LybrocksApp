import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import List from './List';
import Details from './Details';

const RootStack = createStackNavigator(
  {
    Active_Orders: {
      screen: List,
      navigationOptions: {headerShown: false},
    },
    Details: {
      screen: Details,
    },
  },
  {
    initialRouteName: 'Active_Orders',
  },
);

const ActiveOrderScreen = createAppContainer(RootStack);

export default ActiveOrderScreen;
