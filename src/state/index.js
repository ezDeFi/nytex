import { combineReducers, createStore } from 'redux'
import transaction from './reducers/transaction'
import user from './reducers/user'

const todoApp = combineReducers({
  transaction,
  user
});

export default createStore(todoApp)