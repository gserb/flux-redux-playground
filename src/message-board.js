console.log('mesage board');
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { get } from './http';
import logger from 'redux-logger';

export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';

export const UPDATE_STATUS = 'UPDATE_STATUS'; 
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';

export const READY = 'READY';
export const WAITING = 'WAITING';
export const NEW_MESSAGE_SERVER_ACCEPTED = 'NEW_MESSAGE_SERVER_ACCEPTED'; 

const statusUpdateAction = (value) => {
    return {
        type: UPDATE_STATUS,
        value
    }
};

const newMessageAction = (content, postedBy) => {
    const date = new Date();

    get('/api/create', (id) => {
        store.dispatch({
            type: NEW_MESSAGE_SERVER_ACCEPTED
        })
    });

    return {
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
    }
};

const defaultState = {
    messages: [{
        date: new Date('2017-01-01 10:11:55'),
        postedBy: 'Vasilica',
        content: 'I <3 new productivy app!'
    }],
    userStatus: ONLINE,
    apiCommunicationStatus: READY
};

const userStatusReducer = (state = defaultState.userStatus, {type, value}) => {
      switch(type) {
        case UPDATE_STATUS:
            return value;
            break;
    }
    return state;
};

const apiCommunicationStatusReducer = (state = READY, {type}) => {
    switch (type) {
        case CREATE_NEW_MESSAGE:
            return WAITING;
        case NEW_MESSAGE_SERVER_ACCEPTED:
            return READY;
    }
    return state;
};

const messagesReducer = (state = defaultState.messages, {type, value, postedBy, date}) => {
    switch(type) {
        case CREATE_NEW_MESSAGE:
            const newState = [{date, postedBy, content: value}, ... state ];
            return newState;
    }
    return state;
};

const combineReducer = combineReducers({
    userStatus: userStatusReducer,
    messages: messagesReducer,
    apiCommunicationStatusReducer: apiCommunicationStatusReducer
});

const store = createStore(
    combineReducer,
    applyMiddleware(logger())
);

const render = () => {
    const { messages, userStatus, apiCommunicationStatus } = store.getState();
    document.getElementById('messages').innerHTML = messages
        .sort((a,b) => b.date - a.date)
        .map(message => (
            `<div>
                ${message.postedBy}: ${message.content}
            </div>`
        )).join("");

    document.forms.newMessage.fields.disabled = ( userStatus === OFFLINE || apiCommunicationStatus === WAITING );
    document.forms.newMessage.newMessage.value = "";
};

document.forms.newMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = e.target.newMessage.value;
    const username = localStorage['preferences'] ? JSON.parse(localStorage['preferences']).username : "VasiXX";
    store.dispatch(newMessageAction(value, username));
});



document.forms.selectStatus.status.addEventListener("change", (e) => {
    store.dispatch(statusUpdateAction(e.target.value));
});

render();

store.subscribe(render);

console.log('Making request...');
get('http://pluralsight.com', (id) => {
    console.log('Received callback', id);
})