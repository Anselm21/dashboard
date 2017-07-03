import {ACTIONS} from './actions';
import _ from 'lodash';
const MAX_LAST_EVENTS = 20;

export default function reducer(state = {}, action = {}) {
    switch (action.type) {

        case ACTIONS.NEW_EVENT:
            console.log('STATE', state);
            const clusterName = action.topic;
            console.log(action.topic);
            const lastOld = state[clusterName] && state[clusterName].stats ? state[clusterName].stats : [];
            console.log('lastOld ', lastOld);
            const last = [...lastOld];
            const data = action.event;

            last.push(data);
            console.log('LAST ', last);
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

        default:
            return state;
    }
}

