import React, { useState, useCallback } from "react"
import AddFilledIcon from "@material-ui/icons/Add"
import EditFilledIcon from "@material-ui/icons/Edit"
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined"
import { useQuery, useMutation } from "@apollo/react-hooks"
import {
  Typography,
  Container,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  TableBody,
} from "@material-ui/core"

import User from "../../../types/User"
import classes from "./Users.module.scss"
import UserModal from "./UserModal/UserModal"
import Loading from "../../../components/Loading/Loading"
import { USERS_QUERY, usersQueryData } from "../../../graphql/user/users"
import { DELETE_USER_MUTATION, deleteUserMutationData } from "../../../graphql/user/deleteUser"

const Users: React.FC = () => {
  const [openUserModal, setOpenUserModal] = useState(false)
  const [updateUser, setUpdateUser] = useState<User | null>(null)
  const { data, loading: queryLoading, error: queryError, refetch } = useQuery<usersQueryData>(USERS_QUERY)
  const [deleteUser, { loading: deleteLoading, error: deleteError }] = useMutation<deleteUserMutationData>(DELETE_USER_MUTATION)

  const handleDeleteUser = useCallback(async (user: User) => {
    const { data } = await deleteUser({
      variables: {
        userId: user.id,
      },
    })

    if (data?.deleteUser) {
      refetch()
    }
  }, [deleteUser, refetch])

  return (
    <>
      {(queryLoading || deleteLoading) && <Loading />}
      <Typography variant="h3" align="center" paragraph>Users</Typography>
      {(queryError || deleteError)?.graphQLErrors.map(err => (
        <Typography key={err.message} color="error">{err.message}</Typography>
      ))}
      <Container maxWidth="md">
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow className={classes.tableHead}>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>
                  <div className={classes.actions}>
                    Actions
                    <Button onClick={() => setOpenUserModal(true)} className={classes.addButton}>
                      <AddFilledIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <div className={classes.actions}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setOpenUserModal(true)
                          setUpdateUser(user)
                        }}
                      >
                        <EditFilledIcon />
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user)}>
                        <DeleteOutlinedIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {openUserModal && (
        <UserModal
          onClose={() => {
            setOpenUserModal(false)
            setUpdateUser(null)
          }}
          refetchUsers={refetch}
          user={updateUser!}
        />
      )}
    </>
  )
}

export default Users