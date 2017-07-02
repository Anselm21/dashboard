import React, {Component, PropTypes} from 'react';
import Routes from '../routes';
import {connect} from 'react-redux';
import { connectWebsocketEventsListener } from '../helpers/EventListener';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

@connect(
    state => ({
        events: state.events,
    }))
export default class App extends Component {
    static propTypes = {
        events: PropTypes.object,
        params: PropTypes.object,
        store: PropTypes.object,
    };

    static contextTypes = {
        store: React.PropTypes.object
    };

    componentDidMount() {
        connectWebsocketEventsListener(this.context.store);
    }

    render() {
        return (
            <div>
                <h1>Terradata</h1>
                { Routes }
            </div>
        );
    }
}
