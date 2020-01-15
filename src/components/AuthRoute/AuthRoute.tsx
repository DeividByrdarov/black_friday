import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Route, RouteProps, RouteComponentProps, withRouter } from "react-router-dom"

import { Role } from "../../types/User"
import { AppState } from "../../types/Redux"
import { getUserReducer } from "../../redux/selectors"

type Props = {
  userType: Role
}

const AuthRoute: React.FC<RouteComponentProps & Props & RouteProps> = ({ history, location, userType, ...props }) => {
  const isLoggedIn = useSelector((state: AppState) => Boolean(getUserReducer(state)[userType]))

  useEffect(() => {
    if (!isLoggedIn) {
      history.replace(`${userType === "ADMIN" ? "/admin" : ""}/login`)
    }
  }, [location.pathname, isLoggedIn])

  return <Route {...props} />
}

export default withRouter(AuthRoute)