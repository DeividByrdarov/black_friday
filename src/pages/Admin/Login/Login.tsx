import React, { useCallback } from "react"
import { connect } from "react-redux"
import { useMutation } from "@apollo/react-hooks"
import { RouteComponentProps } from "react-router-dom"
import { Typography, TextField, Container, Button } from "@material-ui/core"

import classes from "./Login.module.scss"
import Loading from "../../../components/Loading/Loading"
import UserActions from "../../../redux/actions/UserActions"
import { useStateForInput } from "../../../hooks"
import { MapThunkTypes } from "../../../types/Redux"
import { CREATE_USER_SESSION_MUTATION, createUserSessionMutationData } from "../../../graphql/user/createUserSession"

const mapDispatchToProps = {
  login: UserActions.login,
}

const Login: React.FC<MapThunkTypes<typeof mapDispatchToProps> & RouteComponentProps> = ({ login, history }) => {
  const [username, setUsername] = useStateForInput("")
  const [password, setPassword] = useStateForInput("")

  const [createUserSession, { loading, error }] = useMutation<createUserSessionMutationData>(CREATE_USER_SESSION_MUTATION)

  const handleLogin = useCallback(async () => {
    const { data } = await createUserSession({
      variables: {
        username,
        password,
      },
    })

    if (!data) return

    login(data.createUserSession)
    history.push("/admin")
  }, [createUserSession, history, login, password, username])

  return (
    <>
      {loading && <Loading />}

      <Typography align="center" variant="h2" paragraph>Login</Typography>

      {error && <Typography color="error">{error?.graphQLErrors[0].message}</Typography>}

      <Container className={classes.container} maxWidth="xs">
        <TextField
          error={Boolean(error)}
          variant="outlined"
          placeholder="Username"
          onChange={setUsername}
          value={username}
          fullWidth
        />
        <TextField
          error={Boolean(error)}
          type="password"
          variant="outlined"
          placeholder="Password"
          onChange={setPassword}
          value={password}
          fullWidth
        />
        <div>
          <Button onClick={handleLogin} color="primary" variant="contained">
            Login
          </Button>
        </div>
      </Container>
    </>
  )
}

export default connect(null, mapDispatchToProps)(Login)