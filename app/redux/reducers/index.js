import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import events from './events/events';

const rootReducer = combineReducers({
    routing,
    events
});

export default rootReducer;
