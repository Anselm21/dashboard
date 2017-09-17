import {ACTIONS} from './actions';
import _ from 'lodash';

export default function reducer(state = {}, action = {}) {
    switch (action.type) {

        case ACTIONS.NEW_EVENT:
            console.log(action.event);
            const data = _.get(action, 'event', {});
            console.log('data: ', data);
            const result = {};
            _.forEach(data, (value, key)=> {
                const serversData = _.get(value, 'sysinfo', {});
                result[key] = {sysInfo: {}, description: _.get(value, 'description', '')};
                _.forEach(serversData, (el, index)=> {
                    result[key].sysInfo[index] = {
                        status: el.status,
                        data: el.status === 200 ? JSON.parse(el.text) : el.text
                    };
                });
            });
            console.log('parsed: ', result);
            return {
                masterFailed: false,
                dataSum: result
            };

        case ACTIONS.SERVER_ERROR:
            return {
                ...state,
                [action.topic]: {
                    ...state[action.topic],
                    failedServers: action.failedServersNumber
                }
            };

        default:
            return state;
    }
}

