import { Dispatcher , Store} from './flux';

const controlPanelDispatcher = new Dispatcher();

document.getElementById('userNameInput').addEventListener('input', ({target}) => {
  const name = target.value;
  console.log('Dispatching ....', name);
  controlPanelDispatcher.dispatch('TODO__NAMEINPUTACTION');
});

document.forms.fontSizeForm.fontSize.forEach(element => {
  element.addEventListener('change', ({target}) => {
    controlPanelDispatcher.dispatch('TODO__FONTUPDATEACTION');
  })
})

class UserPrefsStore extends Store {
  getInitialState() {
    return {
      userName: 'Jim',
      fontSize: 'small'
    }
  }

  __onDispatch(action) {
    console.log('Store received dispatch', action);
    this.__emitChange();
  }
  
  getUserPreferences() {
    return this.__state;
  }
}

const userPrefsStore = new UserPrefsStore(controlPanelDispatcher);

userPrefsStore.addListener((state) => {
  console.info('The current state is ...', state);
})

controlPanelDispatcher.register(action => {
  console.info('Received action...', action);
})