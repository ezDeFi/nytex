import React         from "react"
import Layout        from "../components/Layout"
import View          from "../components/View"
import {useSelector, useDispatch} from "react-redux";

const Index = () => {
  // const count = useCounter();
  const count = useSelector(
    state => state.user.count
  )

  const lastBlock = useSelector(
    state => state.transaction.lastBlock
  )
  const dispatch = useDispatch();

  return (
    <Layout>
      <View title="Test Hook">
        <p>block: {lastBlock} times</p>
        <p>You clicked {count} times</p>
        <button onClick={() => dispatch({type: 'INCREMENT'})}>click</button>
        <button onClick={() => dispatch({type: 'UPDATE_LAST_BLOCK', lastBlock: 123})}>edit block</button>
      </View>
    </Layout>
  )
}

export default Index
