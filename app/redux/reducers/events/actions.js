const _ACTIONS = {
    NEW_EVENT: 'NEW_EVENT',
    SERVER_ERROR: 'SERVER_ERROR',
};

Object.keys(_ACTIONS).forEach((key) => {
    _ACTIONS[key] = 'events/' + _ACTIONS[key];
});
export const ACTIONS = _ACTIONS;
