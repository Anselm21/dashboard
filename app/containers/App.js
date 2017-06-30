import React, {Component, PropTypes} from 'react';
import Routes from '../routes';
import {connect} from 'react-redux';
import { connectWebsocketEventsListener } from '../helpers/EventListener';
connectWebsocketEventsListener();
@connect(
    state => ({
        events: state.events,
    }))
export default class App extends Component {
    static propTypes = {
        events: PropTypes.object,
        params: PropTypes.object,
    };

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                { Routes }
            </div>
        );
    }
}
