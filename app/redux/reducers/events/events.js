import {ACTIONS} from './actions';
import _ from 'lodash';

const MAX_LAST_EVENTS = 20;

export default function reducer(state = {}, action = {}) {
    switch (action.type) {

        case ACTIONS.NEW_EVENT:

            const lastOld = _.get(state, action.topic, []);

            const last = [...lastOld];
            const data = action.event;

            last.push(data);

            if (last.length > MAX_LAST_EVENTS) {
                last.shift();
            }

            return {
                ...state,
                [action.topic]: last
            };

        default:
            return state;
    }
}

