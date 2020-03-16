import React, {useState} from 'react'
import BasePage          from "../StandardPage";
import {useSelector}     from "react-redux";
import {Col, Spin}       from "antd";

const Login = () => {
  const loginMetamask = useSelector(state => state.user.loginMetamask)

  return (
    <BasePage>
      <div>
        <div className="p_login ebp-wrap" >
          <Col span={24} style={{ marginTop: '30px', marginBottom: '30px' }}>
            {(loginMetamask) && <div>
              <Spin tip="Logging in with MetaMask...">
              </Spin>
            </div>}
            {(!loginMetamask) && <div className="login-metamask">
              <img src="/assets/images/metamask.svg" with="100px" height="100px" />
              <h3>Login with
                <span> </span><a href="https://metamask.io/" target="_blank">MetaMask</a> or
                <span> </span><a href="https://ezdefi.com" target="_blank">ezDeFi Extension (Alpha)</a>
              </h3>
            </div>}
          </Col>
        </div>
      </div>
    </BasePage>
  );
}

export default Login