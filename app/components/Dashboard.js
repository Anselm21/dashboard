import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {ServerPanel} from '../components';

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
        console.log('EVENTS', events);
        const serverTabs = [];
        for (let el in events) {
            if (!events.hasOwnProperty(el)) {
                continue;
            }
            serverTabs.push(<ServerPanel key={el} name={el} stats={events[el]}/>);
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
