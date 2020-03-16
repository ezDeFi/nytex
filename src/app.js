import React from 'react' // eslint-disable-line
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Route, Switch } from 'react-router-dom' // eslint-disable-line
import { Provider } from 'react-redux' // eslint-disable-line
import { Router } from "react-router";
import store from '@/store'
import config from '@/config'
import Helmet from 'react-helmet'
import './boot'
import './style/index.scss'
import {getUserProfile, loginEzdefi} from './util/auth'

const middleware = (render, props) => {
  return render
}

const App = () => { // eslint-disable-line
  return (
    <div>
      <Helmet>
        {/* <script defer src="/assets/js/web310.js"></script> */}
      </Helmet>
      <Switch id="ss-main">
        {_.map(config.router, (item, i) => {
          const props = _.omit(item, ['page', 'path', 'type'])
          const R = item.type || Route // eslint-disable-line
          return (
            <R path={item.path} key={i} exact component={item.page} {...props} />
          )
        })}
      </Switch>
    </div>
  )
}

const render = async () => {
  await loginEzdefi()

  ReactDOM.render(
    <Provider store={store}>
      <Router middleware={middleware} history={store.history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('ss-root')
  )
}

if (sessionStorage.getItem('api-token')) { // eslint-disable-line
  getUserProfile(render)
} else {
  render()
}
