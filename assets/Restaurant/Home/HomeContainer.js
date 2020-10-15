import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Home from './Home';
import Details from '../ActiveOrders/Details';

const RootStack = createStackNavigator(
  {
    user: {
      screen: Home,
    },
    Details: {
      screen: Details,
    },
  },
  {
    initialRouteName: 'user',
  },
);

const HomeContainer = createAppContainer(RootStack);

export default HomeContainer;
