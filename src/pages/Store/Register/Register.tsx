import React, { useCallback } from "react"
import { useHistory } from "react-router-dom"
import { useMutation } from "@apollo/react-hooks"
import { Container, TextField, Typography, Button } from "@material-ui/core"

import classes from "./Register.module.scss"
import { useStateForInput } from "../../../hooks"
import { CREATE_USER_MUTATION, createUserMutationData } from "../../../graphql/user/createUser"
import Loading from "../../../components/Loading/Loading"

type Props = {}

const Register: React.FC<Props> = () => {
  const [createUserMutation, { loading, error }] = useMutation<createUserMutationData>(CREATE_USER_MUTATION)
  const history = useHistory()

  const [firstName, setFirstName] = useStateForInput("")
  const [lastName, setLastName] = useStateForInput("")
  const [username, setUsername] = useStateForInput("")
  const [password, setPassword] = useStateForInput("")
  const [repeatPassword, setRepeatPassword] = useStateForInput("")

  const handleRegister = useCallback(async () => {
    try {
      const { data, errors } = await createUserMutation({
        variables: {
          name: `${firstName} ${lastName}`,
          username,
          password,
          repeatPassword,
        },
      })

      if (!data?.createUser.id) return

      history.push("/login")
    } catch (err) {
    }
  }, [createUserMutation, firstName, history, lastName, password, repeatPassword, username])

  return (
    <Container maxWidth="xs" className={classes.container}>
      {loading && <Loading />}

      <Typography variant="h4" align="center">Create Account</Typography>

      {error && <Typography color="error">{error?.graphQLErrors[0].message}</Typography>}

      <div className={classes.names}>
        <TextField
          variant="outlined"
          label="First name"
          onChange={setFirstName}
          value={firstName}
        />
        <TextField
          variant="outlined"
          label="Last name"
          onChange={setLastName}
          value={lastName}
        />
      </div>

      <TextField
        variant="outlined"
        label="Username"
        onChange={setUsername}
        value={username}
      />

      <TextField
        variant="outlined"
        label="Password"
        type="password"
        onChange={setPassword}
        value={password}
      />

      <TextField
        variant="outlined"
        label="Repeat Password"
        type="password"
        onChange={setRepeatPassword}
        value={repeatPassword}
      />

      <Typography align="right" variant="caption" color="error">All fields are required!</Typography>

      <Button
        color="primary"
        variant="contained"
        onClick={handleRegister}
      >
        Register
      </Button>
    </Container>
  )
}

export default Register