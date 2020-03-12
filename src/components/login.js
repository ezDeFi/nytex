import React from "react"
import { navigate } from "gatsby"
import { loginEzdefi } from "../utils/auth"
import LayoutStyle from "../styles/layout.module.css"
import {useSelector} from "react-redux";

const Login = () => {
  const justLogout = useSelector(state => state.user.justLogout)
  console.log(justLogout)
  if(!justLogout) {
    loginEzdefi(function () {
      navigate(`/app/tx`)
    });
  }

  return (
    <>
      <div className={LayoutStyle.loginContainer}>
        <img src="https://governance.nexty.io/assets/images/metamask.svg" className={LayoutStyle.metamartLogo} alt=""/>
        <h3>Login with
          <a href="https://medium.com/nextyplatform/how-to-be-a-sealer-on-nexty-network-6e5877fba825#1764" rel="noopener">
            MetaMask
          </a> or
          <a href="https://medium.com/nextyplatform/how-to-be-a-sealer-on-nexty-network-6e5877fba825#1764" rel="noopener">
            ezDeFi Extension (Alpha)
          </a></h3>
      </div>
    </>
  )
}

export default Login
