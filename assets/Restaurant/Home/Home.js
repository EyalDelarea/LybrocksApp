/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
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
import {ListItem, Badge, Avatar, Card} from 'react-native-elements';
import {fetchDatabase, store} from '../../../redux/app-redux';

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: this.props.loading,
      fireDatabase: this.props.fireDatabase,
    };
    this.applyStatusStyle = this.applyStatusStyle.bind(this);
  }

  static propTypes = {};

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

  render() {
    return (
      <>
        <Card>
          <Card.Title>
            {this.state.fireDatabase._docs[0]._data.customerName}
          </Card.Title>
          <Card.Divider />
        </Card>
        <Card>
          <Card.Title>History</Card.Title>
          <Card.Divider />
          <FlatList
            //TODO FIX NAVIGATION TO DETAILS SCREEN
            data={this.props.fireDatabase._docs}
            renderItem={({item}) => {
              if (item._data.status === 'Arrived') {
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
                            {item._data.totalCost + ' ₪ '}
                          </ListItem.Subtitle>
                          <ListItem.Subtitle>
                            <Badge
                              value={item._data.status}
                              status={this.applyStatusStyle(item._data.status)}
                              containerStyle={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                              }}
                            />
                          </ListItem.Subtitle>
                        </ListItem.Content>
                      </ListItem>
                    </Swipeable>
                  </TouchableOpacity>
                );
              }
            }}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={this.refresh} />
            }
          />
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fireDatabase: state.fireDatabase,
    loading: state.loading,
  };
};

export default connect(mapStateToProps)(Home);
