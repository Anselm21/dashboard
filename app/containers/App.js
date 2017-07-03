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
            serversData: {},
            requestCounter: 0
        };
        this.getClusterInfo = this.getClusterInfo.bind(this);
        this.getServerInfo = this.getServerInfo.bind(this);
    }

    componentWillMount() {
        _.forOwn(config.clusters_list, (value, key) => {
            this.setState({
                serversData: {
                    ...this.state.serversData,
                    [key]: []
                }
            });
        });
    }

    componentDidMount() {
        _.forOwn(config.clusters_list, (value, key) => {
            this.getClusterInfo(key);
        });
    }

    getServerInfo(url, clusterName, requestCount) {
        request
            .get(url)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (requestCount === this.state.requestCounter) {
                    if (err || !res.ok) {
                        console.log('error ', err);
                        this.setState({
                            serversData: {
                                ...this.state.serversData,
                                [clusterName]: [...this.state.serversData[clusterName], false]
                            }
                        });
                    } else {
                        console.log('got data ', res.body);
                        this.setState({
                            serversData: {
                                ...this.state.serversData,
                                [clusterName]: [...this.state.serversData[clusterName], res.body]
                            }
                        });
                    }
                }
            });
    }

    getClusterInfo(clusterName) {
        this.aggregateClusterStats(clusterName);
        this.setState({
            requestCounter: this.state.requestCounter + 1,
            serversData: {
                ...this.state.serversData,
                [clusterName]: []
            }
        });
        _.forEach(config.clusters_list[clusterName].servers, (url) => {
            this.getServerInfo(url, clusterName, this.state.requestCounter);
        });
        setTimeout(()=>this.getClusterInfo(clusterName), 3000);
    }

    aggregateClusterStats(clusterName) {
        const configuredServersCount = config.clusters_list[clusterName].servers.length;
        const store = this.context.store;
        const serversList = this.state.serversData[clusterName];
        let liveServersNumber = 0;
        const results = {
            cpu_used: 0,
            memory_total: 0,
            memory_used: 0,
            rx_speed: 0,
            tx_speed: 0
        };
        if(serversList.length > 0) {
            _.forEach(serversList, (data) => {
                if(data === false) {
                    console.log('failed loading from server');
                } else {
                    results.cpu_used += data.cpu_used;
                    results.memory_total += data.memory_total;
                    results.memory_used += data.memory_used;
                    results.tx_speed += data.tx_speed;
                    results.rx_speed += data.rx_speed;
                    liveServersNumber += 1;
                }
                const failedServers = configuredServersCount - liveServersNumber;
                store.dispatch({
                    type: ACTIONS.SERVER_ERROR,
                    topic: clusterName,
                    failedServersNumber: failedServers
                });
                if (liveServersNumber > 0) {
                    results.cpu_used = results.cpu_used / liveServersNumber;
                    store.dispatch({
                        type: ACTIONS.NEW_EVENT,
                        topic: clusterName,
                        event: results
                    });
                }
            });
        }
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
