import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {ServerPanel} from '../components';
import {ProgressBar} from 'react-bootstrap';
import _ from 'lodash';
import { ACTIONS } from '../redux/reducers/events/actions';
import request from 'superagent';
const config = require('../../config.json');

@connect(
    state => ({
        events: state.events,
    }))
export default class Dashboard extends Component {
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
        this.getClusterInfo = this.getClusterInfo.bind(this);
        this.getServerInfo = this.getServerInfo.bind(this);
    }

    componentDidMount() {
        this.getClusterInfo();
    }

    getServerInfo(url) {
        const store = this.context.store;
        request
            .get(url)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (err || !res.ok) {
                    console.log('error ', err);
                } else {
                    console.log('dispatch');
                    store.dispatch({
                        type: ACTIONS.NEW_EVENT,
                        event: res.body
                    });
                }
            });
    }

    getClusterInfo() {
        this.getServerInfo(config.master_script);
        setTimeout(()=>this.getClusterInfo(), 5000);
    }

    renderServerTabs() {
        const {events} = this.props;
        const serverTabs = [];
        const clusters = _.get(events, 'dataSum', {});
        console.log('EVENTS!!!!: ', events);
        for (let el in clusters) {
            if (!clusters.hasOwnProperty(el)) {
                continue;
            }
            console.log('ELEMENT: ', el);
            console.log('GETTTTT: ', _.get(clusters, `[${el}].sysInfo`, {}));
            serverTabs.push(<ServerPanel key={el}
                                         name={el}
                                         stats={_.get(clusters, `[${el}].sysInfo`, {})}
                                         description={_.get(clusters, `[${el}].description`, '')}/>);
        }
        if (serverTabs.length === 0) {
            return <ProgressBar active now={100} label="LOADING CLUSTERS DATA"/>;
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
