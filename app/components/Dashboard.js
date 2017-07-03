import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {ServerPanel} from '../components';
import _ from 'lodash';

@connect(
    state => ({
        events: state.events,
    }))
export default class Dashboard extends Component {
    static propTypes = {
        events: PropTypes.object,
        params: PropTypes.object,
    };

    componentWillMount() {
        console.log('mounted Dashboard');
    }

    renderServerTabs() {
        const {events} = this.props;
        const serverTabs = [];
        for (let el in events) {
            if (!events.hasOwnProperty(el)) {
                continue;
            }
            const stats = _.get(events[el], 'stats', []);
            const failedServersNumber = _.get(events[el], 'failedServers', 0);
            serverTabs.push(<ServerPanel key={el} name={el} stats={stats} failedServers={failedServersNumber}/>);
        }
        return serverTabs;
    }

    render() {
        return (
            <div key="Dashboard" className="container">
                <Helmet title="Dashboard"/>
                {this.renderServerTabs()}
            </div>);
    }
}
