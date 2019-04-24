import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import task from './redux/task'
import user from './redux/user'
import pairEx from './redux/pairEx'
import volatileToken from './redux/volatileToken'
import stableToken from './redux/stableToken'
import contracts from './redux/contracts'
import community from './redux/community'

const default_state = { // eslint-disable-line
  init: false
}

const appReducer = (state = default_state, action) => {
  switch (action.type) {

  }

  return state
}

export default combineReducers({
  app: appReducer,
  router: routerReducer,
  task: task.getReducer(),
  contracts: contracts.getReducer(),
  user: user.getReducer(),
  pairEx: pairEx.getReducer(),
  volatileToken: volatileToken.getReducer(),
  stableToken: stableToken.getReducer(),
  community: community.getReducer()
})
