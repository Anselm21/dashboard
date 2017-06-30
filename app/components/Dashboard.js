import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';

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

    render() {
        return (
            <div>
                <Helmet title="Dashboard"/>
                <div>
                    Hello from dashboard
                </div>
            </div>);
    }
}
