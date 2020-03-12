import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { checkLogin } from "../utils/auth"


const PrivateRoute = ({ component: Component, location, ...rest }) => {
  checkLogin(function () {
    navigate(`/app/login`)
  })
  // if (isLoggedIn() === false && location.pathname !== `/app/login`) {
  //   // If we’re not logged in, redirect to the home page.
  //   navigate(`/app/login`)
  //   return null
  // }

  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
}

export default PrivateRoute
