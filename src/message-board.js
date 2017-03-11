import { createStore } from 'redux';

export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';

export const UPDATE_STATUS = 'UPDATE_STATUS'; 

const defaultState = {
    messages: [{
        date: new Date('2017-01-01 10:11:55'),
        postedBy: 'Vasilica',
        content: 'I <3 new productivy app!'
    }],
    userStatus: ONLINE
};

const store = createStore((state = defaultState)=>{
    return state;
});

const render = () => {
    const { messages, userStatus } = store.getState();
    document.getElementById('messages').innerHTML = messages
        .sort((a,b) => b.date - a.date)
        .map(messages => {
            `<div>
                ${message.postedBy}: ${message.content}
            </div>`
        }).join("");
};

render();