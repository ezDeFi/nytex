import React from "react"
import { Helmet } from "react-helmet"
import Header from "../Header"
import Footer from "../Footer"
import { Layout, Menu, Breadcrumb } from 'antd';

// Global styles and component-specific styles.
import "./global.css"
import 'antd/dist/antd.css'
import styles from "./main.module.css"

const MyLayout = ({ children }) => (
  <Layout style={{backgroundColor: '#252C3F'}}>
    <Helmet title="Simple Authentication With Gatsby" />
    <Header />
    <main className={styles.main}>{children}</main>
    {/*<Footer/>*/}
  </Layout>
)

export default MyLayout
