import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default class NotFound extends Component {

    render() {
        return (
            <div key="notFound">
                <Helmet title="Not Found"/>
                <div>
                   Page Not Found
                </div>
            </div>);
    }
}
