import {combineReducers} from 'redux'
import {routerReducer}   from 'react-router-redux'

import user          from './redux/user'
import contracts     from './redux/contracts'
import community     from './redux/community'
import preemptive    from './redux/preemptive'
import seigniorage   from './redux/seigniorage'
import volatileToken from './redux/volatileToken'
import stableToken   from './redux/stableToken'
import exchange      from './redux/exchange'
import common        from './redux/common'

const default_state = { // eslint-disable-line
  init: false
}

const appReducer = (state = default_state, action) => {
  switch (action.type) {

  }

  return state
}

export default combineReducers({
  app          : appReducer,
  router       : routerReducer,
  contracts    : contracts.getReducer(),
  user         : user.getReducer(),
  community    : community.getReducer(),
  preemptive   : preemptive.getReducer(),
  seigniorage  : seigniorage.getReducer(),
  stableToken  : stableToken.getReducer(),
  volatileToken: volatileToken.getReducer(),
  exchange     : exchange.getReducer(),
  common       : common.getReducer()
})
