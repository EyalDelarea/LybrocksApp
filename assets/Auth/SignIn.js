import React, {Component} from 'react';
import {Text, View} from 'react-native';

export default class SignIn extends Component {
    state = {};

    constructor(props) {
        super(props);
    }

    static propTypes = {};

    componentDidMount() {
    }

    render() {
        return (
            <View
                style={styles.style}>
                <Text>Hello</Text>
            </View>
        );
    }
}

