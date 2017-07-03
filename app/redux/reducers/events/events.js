import {ACTIONS} from './actions';
import _ from 'lodash';
const MAX_LAST_EVENTS = 20;

export default function reducer(state = {}, action = {}) {
    switch (action.type) {

        case ACTIONS.NEW_EVENT:
            const clusterName = action.topic;
            const lastOld = state[clusterName] && state[clusterName].stats ? state[clusterName].stats : [];
            const last = [...lastOld];
            const data = action.event;

            last.push(data);
            if (last.length > MAX_LAST_EVENTS) {
                last.shift();
            }

            return {
                ...state,
                [clusterName]: {
                    ...state[clusterName],
                    stats: last,
                }
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

