import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {dismiss} from 'react-native/Libraries/LogBox/Data/LogBoxData';

//
// Initial State...
//

const initialState = {
  fireDatabase: [],
  loading: true,
};

//
// Reducer...
//

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_DATABASE':
      return {
        ...state,
        fireDatabase: action.value,
        loading: false,
      };
    case 'GET_DATABASE_FROM_STATE':
      return {
        ...state,
      };
    default:
      return state;
  }
};

//
// Store...
//

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export {store};

//
// Action Creators
//

const getDatabase = (fireDatabase) => {
  return {
    type: 'GET_DATABASE',
    value: fireDatabase,
  };
};
const addOrder = (order) => {
  return {
    type: 'ADD_ORDER',
    value: order,
  };
};

const fetchDatabase = () => {
  return async (dispatch) => {
    await firestore()
      .collection('Orders')
      .onSnapshot(
        (snapshot) => {
          dispatch(getDatabase(snapshot));
        },
        (error) => console.log('error'),
      );
  };
};

const writeOrder = (order) => {
  firestore()
    .collection('Orders')
    .add({
      customerName: order.customerName,
      address: order.address,
      notes: order.notes,
      totalCost: order.totalCost,
      etaSelected: order.etaSelected,
      credit: order.credit,
      cash: order.cash,
      status: 'Waiting approval',
      date: this.dateToArray(),
      readableDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
    })
    .catch((error) => console.log(error))
    .finally((snapshot) => console.log('Item has been added ' + snapshot));
};

export {fetchDatabase, writeOrder};
