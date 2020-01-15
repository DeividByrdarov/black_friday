import React, { useCallback } from "react"
import { useMutation } from "@apollo/react-hooks"
import { ApolloQueryResult } from "apollo-client/core/types"
import { Typography, TextField, Select, MenuItem, Button } from "@material-ui/core"

import User from "../../../../types/User"
import classes from "./UserModal.module.scss"
import Modal from "../../../../components/Modal/Modal"
import Loading from "../../../../components/Loading/Loading"
import { useStateForInput } from "../../../../hooks"
import { usersQueryData } from "../../../../graphql/user/users"
import { CREATE_USER_MUTATION, createUserMutationData } from "../../../../graphql/user/createUser"
import { updateUserMutationData, UPDATE_USER_MUTATION } from "../../../../graphql/user/updateUser"

type Props = {
  onClose: () => void
  user?: User
  refetchUsers: () => Promise<ApolloQueryResult<usersQueryData>>
}

const UserModal: React.FC<Props> = ({ onClose, user, refetchUsers }) => {
  const [name, setName] = useStateForInput(user?.name || "")
  const [username, setUsername] = useStateForInput(user?.username || "")
  const [password, setPassword] = useStateForInput("")
  const [repeatPassword, setRepeatPassword] = useStateForInput("")
  const [role, setRole] = useStateForInput(user?.role || "CUSTOMER")

  const [createUser, { loading: createLoading, error: createErrors }] = useMutation<createUserMutationData>(CREATE_USER_MUTATION)
  const [updateUser, { loading: updateLoading, error: updateErrors }] = useMutation<updateUserMutationData>(UPDATE_USER_MUTATION)

  const handleSave = useCallback(async () => {
    let data

    try {
      if (user) {
        const response = await updateUser({
          variables: {
            id: user.id,
            name,
            username,
            role,
          },
        })

        data = response.data?.updateUser
      } else {
        const response = await createUser({
          variables: {
            name,
            username,
            password,
            repeatPassword,
            role,
          },
        })

        data = response.data?.createUser
      }
    } catch (err) {
      console.error(err)
    }

    if (data?.id) {
      refetchUsers()
      onClose()
    }
  }, [name, onClose, password, refetchUsers, role, user, username])

  return (
    <Modal onClose={onClose}>
      {(createLoading || updateLoading) && <Loading />}
      <div className={classes.wrapper}>
        <Typography align="center" variant="h4">{user ? "Edit" : "New"} User</Typography>
        {(createErrors || updateErrors)?.graphQLErrors.map(err => (
          <Typography key={err.message} color="error">{err.message}</Typography>
        ))}
        <div className={classes.field}>
          <Typography component="label" htmlFor="name" align="center">Name</Typography>
          <TextField
            variant="outlined"
            placeholder="Enter name..."
            name="name"
            id="name"
            value={name}
            onChange={setName}
          />
        </div>
        <div className={classes.field}>
          <Typography component="label" htmlFor="username" align="center">Username</Typography>
          <TextField
            variant="outlined"
            placeholder="Enter username..."
            name="username"
            id="username"
            value={username}
            onChange={setUsername}
          />
        </div>
        {!user && (
          <>
            <div className={classes.field}>
              <Typography component="label" htmlFor="password" align="center">Password</Typography>
              <TextField
                variant="outlined"
                placeholder="Enter password..."
                name="password"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
              />
            </div>
            <div className={classes.field}>
              <Typography component="label" htmlFor="repeatPassword" align="center">Repeat Password</Typography>
              <TextField
                variant="outlined"
                placeholder="Repeat password..."
                name="repeatPassword"
                id="repeatPassword"
                type="password"
                value={repeatPassword}
                onChange={setRepeatPassword}
              />
            </div>
          </>
        )}
        <div className={classes.field}>
          <Typography component="label" htmlFor="role" align="center">Role</Typography>
          <Select onChange={setRole} value={role} name="role" id="role" variant="outlined">
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="CUSTOMER">Customer</MenuItem>
          </Select>
        </div>
        <div className={classes.actions}>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default UserModal