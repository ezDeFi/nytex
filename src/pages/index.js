import React         from "react"
import Layout        from "../components/Layout"
import View          from "../components/View"
import {useSelector} from "react-redux";

const Index = () => {
  const count = useSelector(
    state => state.count
  )

  return (
    <Layout>
      <View title="Simple Authentication Example">
        <p>You clicked {count} times</p>
      </View>
    </Layout>
  )
}

export default Index
