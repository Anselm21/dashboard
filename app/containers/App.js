import React, {Component, PropTypes} from 'react';
import Routes from '../routes';
import {connect} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { ACTIONS } from '../redux/reducers/events/actions';
import request from 'superagent';
const config = require('../../config.json');
import _ from 'lodash';


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

    constructor(...params) {
        super(...params);
        this.state = {
            serversData: [],
        };
        this.getClusterInfo = this.getClusterInfo.bind(this);
        this.getServerInfo = this.getServerInfo.bind(this);
    }

    componentDidMount() {
        this.getClusterInfo();
    }

    getServerInfo(url) {
        request
            .get(url)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (err || !res.ok) {
                    console.log('error ', err);
                    this.setState({
                        serversData: [...this.state.serversData, false]
                    });
                } else {
                    console.log('got data ', res.body);
                    this.setState({
                        serversData: [...this.state.serversData, res.body]
                    });
                }
                this.calcClusterStats();
            });
    }

    getClusterInfo() {
        console.log(config);
        _.forOwn(config.clusters_list, (value, key) => {
            console.log(key);
            console.log(value);
            _.forEach(value.servers, (url) => {
                console.log(url);
                this.getServerInfo(url);
            });
        });
        setTimeout(this.getClusterInfo, 3000);
    }

    calcClusterStats() {




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
