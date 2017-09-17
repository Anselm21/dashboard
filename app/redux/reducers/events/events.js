import {ACTIONS} from './actions';
import _ from 'lodash';

export default function reducer(state = {}, action = {}) {
    switch (action.type) {

        case ACTIONS.NEW_EVENT:
            console.log(action.event);
            const data = action.event;
            console.log('data: ', data);
            const result = {};
            _.forEach(data, (value, key)=> {
                result[key] = {};
                _.forEach(value, (el, index)=> {
                    result[key][index] = {
                        status: el.status,
                        data: JSON.parse(el.text)
                    };
                });
            });
            console.log('parsed: ', result);
            return {
                masterFailed: false,
                sysInfo: result
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

