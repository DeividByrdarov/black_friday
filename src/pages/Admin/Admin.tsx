import React, { useEffect } from "react"
import moment from "moment"
import { connect } from "react-redux"
import { Link, Route, Redirect } from "react-router-dom"
import { Grid, Typography, Box, Button, useTheme } from "@material-ui/core"

import Login from "./Login/Login"
import Users from "./Users/Users"
import classes from "./Admin.module.scss"
import Receipts from "./Receipts/Receipts"
import Products from "./Products/Products"
import AuthRoute from "../../components/AuthRoute/AuthRoute"
import { useLogout } from "../../hooks"
import { AppState } from "../../types/Redux"
import { getUserReducer } from "../../redux/selectors"
import Campaigns from "./Campaigns/Campaigns"

const mapStateToProps = (state: AppState) => ({
  isLoggedIn: Boolean(getUserReducer(state).ADMIN),
  expireAt: getUserReducer(state).ADMIN?.expireAt,
})

const Admin: React.FC<ReturnType<typeof mapStateToProps>> = ({ isLoggedIn, expireAt }) => {
  const theme = useTheme()
  const handleLogout = useLogout({ userType: "ADMIN" })
  const logout = useLogout({
    logoutMessage: "Your session has expired, please log in!",
    messageAppearance: "warning",
    userType: "ADMIN",
  })

  useEffect(() => {
    if (expireAt && moment(expireAt)
      .isBefore(moment())) {
      logout()
    }
  }, [])

  return (
    <Grid container className={classes.wrapper}>
      <Grid className={classes.sidebar} item xs={2}>
        <Typography component={Link} to={"/admin"} color="textSecondary" variant="h4" align="center">Admin
          Panel</Typography>
        <Box marginTop={6}>
          <Button
            style={{ color: theme.palette.text.secondary }}
            className={classes.navItem}
            component={Link}
            to="/admin/users"
          >
            Users
          </Button>
          <Button
            style={{ color: theme.palette.text.secondary }}
            className={classes.navItem}
            component={Link}
            to="/admin/products"
          >
            Products
          </Button>
          <Button
            style={{ color: theme.palette.text.secondary }}
            className={classes.navItem}
            component={Link}
            to="/admin/receipts"
          >
            Receipts
          </Button>
          <Button
            style={{ color: theme.palette.text.secondary }}
            className={classes.navItem}
            component={Link}
            to="/admin/campaigns"
          >
            Campaigns
          </Button>
          {isLoggedIn && (
            <Button
              style={{ color: theme.palette.text.secondary }}
              className={classes.navItem}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Grid>
      <Grid item container direction="column" xs={10} alignItems="center" justify="center">
        <AuthRoute userType="ADMIN" path="/admin/users" component={Users} />
        <AuthRoute userType="ADMIN" path="/admin/products" component={Products} />
        <AuthRoute userType="ADMIN" path="/admin/receipts" component={Receipts} />
        <AuthRoute exact userType="ADMIN" path="/admin/campaigns" component={Campaigns} />
        <AuthRoute userType="ADMIN" path="/admin/campaigns/:id" component={Campaigns} />
        <Route path="/admin/login" component={Login} />
        <Route exact path="/admin" render={() => <Redirect to={isLoggedIn ? "/admin/products" : "/admin/login"} />} />
      </Grid>
    </Grid>
  )
}

export default connect(mapStateToProps)(Admin)