import React from "react"
import styles from "./footer.module.css"

const Header = () => (
  <div className={styles[`footer`]}>
    <div className={styles[`contact`]}>
      <div className={styles[`contact__email`]}>
        <p>Email</p>
        <a href="">support@nexty.io</a>
      </div>
      <div className={styles[`contact__social`]}>
        <p>Follow us on</p>
        abcd
      </div>
      <div className={styles[`contact__info`]}>
        <p>What is Nexty Governance ?</p>
        <a href="">How to use</a>
      </div>
    </div>
    <div className={styles.copyRight}>
      2018 © Nexty Platform.
    </div>
  </div>
)

export default Header
