import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/Layout"
import Login from "../components/login"
import PrivateRoute from "../components/PrivateRoute"
import Tx  from "./app/tx"
import Tx2      from "./app/tx2"
import Exchange from "./Exchange/index"

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/tx" component={Tx} />
      <PrivateRoute path="/app/tx2" component={Tx2} />
      <PrivateRoute path="/app/exchange" component={Exchange} />
      <Login path="/app/login" />
    </Router>
  </Layout>
)

export default App
