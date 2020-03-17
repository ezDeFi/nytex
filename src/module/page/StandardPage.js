import React      from 'react' // eslint-disable-line
import { Layout } from 'antd' // eslint-disable-line
import Header     from '../layout/Header'

const BasePage = (props) => {
  return (
    <Layout className="p_standardPage">
       <Header/>
      <Layout.Content>
        {props.children}
      </Layout.Content>
      {/* <Footer /> */}
    </Layout>
  )
}

export default BasePage