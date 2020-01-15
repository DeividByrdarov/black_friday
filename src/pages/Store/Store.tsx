import React, { useEffect } from "react"
import moment from "moment"
import { connect } from "react-redux"
import { Switch, Route, Link, NavLink } from "react-router-dom"
import { AppBar, Button, Toolbar, Typography, Container } from "@material-ui/core"

import Home from "./Home/Home"
import Cart from "./Cart/Cart"
import Login from "./Login/Login"
import Register from "./Register/Register"
import Products from "./Products/Products"
import classes from "./Store.module.scss"
import { AppState } from "../../types/Redux"
import { useLogout } from "../../hooks"
import { getUserReducer } from "../../redux/selectors"
import AuthRoute from "../../components/AuthRoute/AuthRoute"

const mapStateToProps = (state: AppState) => ({
  userSessionId: getUserReducer(state).CUSTOMER?.userSessionId,
  expireAt: getUserReducer(state).CUSTOMER?.expireAt,
})

const Store: React.FC<ReturnType<typeof mapStateToProps>> = ({ expireAt, userSessionId }) => {
  const handleLogout = useLogout({})
  const logout = useLogout({ logoutMessage: "Your session has expired, please log in!", messageAppearance: "warning" })

  useEffect(() => {
    if (expireAt && moment(expireAt)
      .isBefore(moment())) {
      logout()
    }
  }, [])

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            <Link to="/">
              Black Friday Sales
            </Link>
          </Typography>
          <Button component={NavLink} activeClassName={classes.activeLink} exact to="/" color="inherit">Home</Button>
          <Button
            component={NavLink}
            activeClassName={classes.activeLink}
            to="/products"
            color="inherit"
          >
            Products
          </Button>
          {!Boolean(userSessionId) ? (
            <Button component={NavLink} activeClassName={classes.activeLink} to="/login" color="inherit">Login</Button>
          ) : (
            <>
              <Button component={NavLink} activeClassName={classes.activeLink} to="/cart" color="inherit">Cart</Button>
              <Button onClick={handleLogout} color="inherit">Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <Switch>
          <AuthRoute userType="CUSTOMER" path="/cart" component={Cart} />
          <Route path="/products" component={Products} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/" component={Home} />
        </Switch>
      </Container>
    </>
  )
}

export default connect(mapStateToProps)(Store)