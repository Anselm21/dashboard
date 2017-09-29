import React, {Component, PropTypes} from 'react';
import Routes from '../routes';
import logo from '../../static/teradadata-logo.png';

export default class App extends Component {
    render() {
        require('../styles/server_panel.scss');
        return (
            <div>
                <img src={logo} className="logoImg"/>
                { Routes }
            </div>
        );
    }
}

