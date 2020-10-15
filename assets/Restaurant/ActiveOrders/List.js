/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import moment from 'moment';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Text,
  Button,
} from 'react-native';
import {ListItem, SearchBar, Badge, Avatar,Card} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firestore: [],
      error: null,
      query: '',
      searchFlag: false,
      loading: true,
    };

    this.applyStatusStyle = this.applyStatusStyle.bind(this);
    this.searchFilterFunction = this.searchFilterFunction.bind(this);
    this._onPress = this._onPress.bind(this);
    this.refresh = this.refresh.bind(this);
    this.calTimePassed = this.calTimePassed.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.getFireBaseDB = this.getFireBaseDB.bind(this);
  }
  componentDidMount() {
    this.getFireBaseDB();
  }

  getFireBaseDB = async () => {
    await firestore()
      .collection('Orders')
      .where('status', 'in', ['On the way', 'Waiting approval'])
      .get()
      .catch((error) => console.log(' ERROR ' + error))
      .then((snapshot) =>
        this.setState({
          loading: false,
          firestore: snapshot.docs,
        }),
      );
  };

  refresh() {
    this.getFireBaseDB();
    console.log('DB has been refreshed');
  }

  /**
   * Cal the amout of time that has passed since the order was sent to delivery.
   * @param item current item
   * @returns a string xxx minutes \ hours ago
   */
  calTimePassed = (item) => {
    const d = new Date();

    const thisMoment = moment([
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
    ]);
    const itemDate = moment(item._data.date);
    return itemDate.from(thisMoment);
  };

  /**
   * Render separator for list item
   * @returns {JSX.Element}
   */
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  /**
   * Render the head component , search bar.
   * @returns {JSX.Element}
   */
  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search..."
        lightTheme
        round
        onChangeText={(text) => this.searchFilterFunction(text)}
        value={this.state.query}
      />
    );
  };

  /**
   * Search filter function , filtering results from input text
   * @param text
   */
  searchFilterFunction = (text) => {
    this.setState({
      query: text,
    });

    //If the text is empty refresh the list
    if (text === '') {
      this.setState({
        firestore: this.props.firebaseDB,
      });
    } else {
      //insert to newData the filtered items
      const newData = this.state.firestore.filter((item) =>
        item._data.customerName[0].toLowerCase().includes(text.toLowerCase()),
      );
      //update the state with the filtered data
      this.setState({
        firestore: newData,
      });
    }
  };

  /**
   * Function to decide which badge each item gets assigned to
   * @param status
   * @returns {string}
   */
  applyStatusStyle(status) {
    if (status === 'Arrived') {
      return 'success';
    } else if (status === 'On the way') {
      return 'warning';
    } else {
      return 'error';
    }
  }

  /**
   * On press of an FlatList item , navigate to details screen
   * @param item
   * @private
   */
  _onPress(item) {
    this.props.navigation.navigate('Details', {
      item: item,
    });
  }

  /**
   * Deletes an item from the DB
   * @param item
   */
  deleteItem = (item) => {
    const path = item._ref._documentPath._parts[1];
    firestore()
      .collection('Orders')
      .doc(path)
      .delete()
      .then(() => {
        console.log('User deleted!');
      });
    this.refresh();
  };
  render() {
    /**
     * left action for button
     * @returns {JSX.Element}
     * @constructor
     */

    if (this.state.loading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }

    return (
      <>
        <FlatList
          data={this.state.firestore}
          renderItem={({item}) => {
            return (
              <TouchableOpacity onPress={() => this._onPress(item)}>
                <Swipeable
                  renderRightActions={() => (
                    <Button
                      title={'Delete'}
                      color={'red'}
                      onPress={() => this.deleteItem(item)}
                    />
                  )}>
                  <ListItem>
                    <Avatar title={item._data.customerName[0]} />
                    <ListItem.Content>
                      <ListItem.Title>
                        {item._data.customerName[0]}{' '}
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        {item._data.address[0]}
                      </ListItem.Subtitle>
                      <Badge
                        value={item._data.status}
                        status={this.applyStatusStyle(item._data.status)}
                        containerStyle={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                        }}
                      />
                      <ListItem.Subtitle>
                        {item._data.cash ? 'Cash' : 'Credit'}
                      </ListItem.Subtitle>
                      <ListItem.Subtitle>
                        {item._data.totalCost + ' ₪ '}
                      </ListItem.Subtitle>
                      <ListItem.Subtitle>
                        {this.calTimePassed(item)}
                      </ListItem.Subtitle>

                      <ListItem.Subtitle />
                    </ListItem.Content>
                  </ListItem>
                </Swipeable>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={this.refresh} />
          }
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default List;
