import React, { useCallback } from "react"
import { connect } from "react-redux"
import { useMutation } from "@apollo/react-hooks"
import { RouteComponentProps } from "react-router-dom"
import { Container, TextField, Link, Button, Typography } from "@material-ui/core"

import classes from "./Login.module.scss"
import Loading from "../../../components/Loading/Loading"
import UserActions from "../../../redux/actions/UserActions"
import { useStateForInput } from "../../../hooks"
import { MapThunkTypes } from "../../../types/Redux"
import { createUserSessionMutationData, CREATE_USER_SESSION_MUTATION } from "../../../graphql/user/createUserSession"

const mapDispatchToProps = {
  login: UserActions.login,
}

type Props = RouteComponentProps & MapThunkTypes<typeof mapDispatchToProps> & {}

const Login: React.FC<Props> = ({ history, login }) => {
  const [username, setUsername] = useStateForInput("")
  const [password, setPassword] = useStateForInput("")

  const [createUserSessionMutation, { loading, error }] = useMutation<createUserSessionMutationData>(CREATE_USER_SESSION_MUTATION)

  const handleLogin = useCallback(async () => {
    const { data } = await createUserSessionMutation({
      variables: {
        username,
        password,
      },
    })

    if (!data) return

    login(data.createUserSession)
    history.push("/")
  }, [createUserSessionMutation, history, login, password, username])

  return (
    <Container maxWidth="xs" className={classes.container}>
      {loading && <Loading />}

      <Typography variant="h4" align="center">Login</Typography>

      {error && <Typography color="error">{error?.graphQLErrors[0].message}</Typography>}

      <TextField
        error={Boolean(error)}
        variant="outlined"
        label="Username"
        onChange={setUsername}
        value={username}
        fullWidth
      />
      <TextField
        error={Boolean(error)}
        variant="outlined"
        label="Password"
        type="password"
        onChange={setPassword}
        value={password}
        fullWidth
      />
      <Link
        className={classes.registerLink}
        align="right"
        underline="none"
        variant="caption"
        color="textSecondary"
        onClick={() => history.push("/register")}
      >
        Don't have an account? Click here
      </Link>
      <Button
        color="primary"
        variant="contained"
        onClick={handleLogin}
      >
        Login
      </Button>
    </Container>
  )
}

export default connect(null, mapDispatchToProps)(Login)