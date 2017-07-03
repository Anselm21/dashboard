import { ACTIONS } from '../redux/reducers/events/actions';
import request from 'superagent';
const config = require('../../config.json');
import _ from 'lodash';


export function connectWebsocketEventsListener(store) {
    console.log(config);
    _.forOwn(config.clusters_list, (value, key) => {
        console.log(key);
        console.log(value);
        _.forEach(value.servers, (url) => {
            console.log(url);
            getServerInfo(url);
        });
    });
}

export function getServerInfo(url) {
    request
        .get(url)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err || !res.ok) {
                console.log('error ', err);
            } else {
                console.log('got data ', JSON.stringify(res.body));
            }
        });
}
