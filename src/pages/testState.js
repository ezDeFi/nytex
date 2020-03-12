import React             from "react"
import Layout            from "../components/Layout";
import View              from "../components/View";
import {connect} from 'react-redux'

class Index extends React.Component {
  render() {
    return (
      <Layout>
        <View title="Test State">
          <p>You clicked {this.props.count} times</p>
        </View>
      </Layout>
    )
  }
}

function mapStateToProps({count}) {
  return {
    count   : count
  };
}

export default connect(mapStateToProps)(Index)
