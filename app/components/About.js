import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';

@connect(
    state => ({
        events: state.events,
    }))
export default class About extends Component {

    render() {
        return (
            <div key="About">
                <Helmet title="About"/>
                <div>
                    Codeabovelab Dashboard
                </div>
            </div>);
    }
}
