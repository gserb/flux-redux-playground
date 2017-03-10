import { generate as id } from 'shortid';
import { Dispatcher, ReduceStore } from './flux';

const tasksDispatcher = new Dispatcher();

const CREATE_TASK = 'CREATE_TASK';
const COMPLETE_TASK = 'COMPLETE_TASK';
const SHOW_TASKS = 'SHOW_TASKS'; 

const createNewTaskAction = (content) => {
    return {
        type: CREATE_TASK,
        value: content
    }
}

const showTasksAction = (show) => {
    return {
        type: SHOW_TASKS,
        value: show
    }
}

const completeTaskAction = (id, isComplete) => {
    return {
        type: COMPLETE_TASK,
        id,
        value: isComplete
    }
}

class TasksStore extends ReduceStore {
    getInitialState() {
        return {
            tasks: [{
                id: id(),
                content: 'Update CSS styles',
                complete: false
            }, {
                id: id(),
                content: 'Add unit tests',
                complete: false
            }, {
                id: id(),
                content: 'Post to social media',
                complete: false
            }, {
                id: id(),
                content: 'Install hard drive',
                complete: true
            }],
            showComplete: true
        }
    }
    reduce(state, action) {
        console.log('Reducing....', state, action);
        let newState;
        switch(action.type) {
            case CREATE_TASK:
                newState = { ...state, tasks: [...state.tasks] };
                newState.tasks.push({
                    id: id(),
                    content: action.value,
                    complete: false
                });
                return newState;
            case SHOW_TASKS:
                newState = { ...state, tasks: [...state.tasks], showComplete: action.value };
                return newState;
        }
        return state;
    }
    getState() {
        return this.__state;
    }
}

const TaskComponent = ({content, complete, id}) => {
    return `<section>
        ${content} <input type="checkbox" name="taskCompleteCheck" data-taskid=${id} ${complete ? "checked" : ""}>
    </section>`
}

/**
 * Update what is on the page based on the state
 */
const render = () => {
    const tasksSection = document.getElementById('tasks');
    const state = tasksStore.getState();
    const rendered = state.tasks   
        .filter(task => state.showComplete ? true : !task.complete)
        .map(TaskComponent).join("");
    tasksSection.innerHTML = rendered;
}

document.forms.newTask.addEventListener('submit', (e)=> {
    e.preventDefault();
    const name = e.target.newTaskName.value;
    if (name) {
        tasksDispatcher.dispatch(createNewTaskAction(name));
        e.target.newTaskName.value = null;
    }
})

document.getElementById('showComplete').addEventListener('change', ({target}) => {
    const showComplete = target.checked;
    tasksDispatcher.dispatch(showTasksAction(showComplete));
});

const tasksStore = new TasksStore(tasksDispatcher);

tasksDispatcher.dispatch('TEST_DISPATCH');

tasksStore.addListener( () => {
    render();
})

render();