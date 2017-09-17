import {ACTIONS} from './actions';
import _ from 'lodash';

export default function reducer(state = {}, action = {}) {
    switch (action.type) {

        case ACTIONS.NEW_EVENT:
            const data = _.get(action, 'event', {});
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
            return {
                masterFailed: false,
                dataSum: result,
                error: undefined
            };

        case ACTIONS.SERVER_ERROR:
            return {
                ...state,
                masterFailed: true,
                error: action.error
            };
        default:
            return state;
    }
}

