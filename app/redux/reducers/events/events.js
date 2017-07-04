import {ACTIONS} from './actions';
import _ from 'lodash';
const MAX_LAST_EVENTS = 20;

export default function reducer(state = {}, action = {}) {
    switch (action.type) {

        case ACTIONS.NEW_EVENT:
            const clusterName = action.topic;
            const data = action.event;

            return {
                ...state,
                [clusterName]: {
                    ...state[clusterName],
                    stats: data,
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

