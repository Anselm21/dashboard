import { ACTIONS } from '../redux/reducers/events/actions';


export function connectWebsocketEventsListener(store) {
    console.log('connecting...');
    const url = 'http://localhost:5000';
    const socket = require('socket.io-client')('http://localhost:5000');
    socket.on('connect', ()=>{
        console.log('connect');
    });
    socket.on('event', (data)=>{
        console.log('event ', data);
    });
    socket.on('message', (data)=>{
        console.log('message ', data);
        if (data.server_name) {
            store.dispatch({
                type: ACTIONS.NEW_EVENT,
                topic: data.server_name,
                event: data
            });
        }
    });
    socket.on('disconnect', ()=>{
        console.log('disconnect');
    });
}

