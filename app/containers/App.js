import React, {Component, PropTypes} from 'react';
import Routes from '../routes';

export default class App extends Component {
    render() {
        return (
            <div>
                <h1 className="mainTitle">Terradata</h1>
                { Routes }
            </div>
        );
    }
}

