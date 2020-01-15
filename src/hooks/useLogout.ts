import { useCallback } from "react"
import { useMutation } from "@apollo/react-hooks"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

import UserActions from "../redux/actions/UserActions"
import { AppState } from "../types/Redux"
import { getUserReducer } from "../redux/selectors"
import { DELETE_USER_SESSION_MUTATION } from "../graphql/user/deleteUserSession"
import { useToasts, AppearanceTypes } from "react-toast-notifications"
import { Role } from "../types/User"

interface Props {
  logoutMessage?: string
  messageAppearance?: AppearanceTypes
  userType?: Role
}

const useLogout = ({ logoutMessage, messageAppearance, userType = "CUSTOMER" }: Props) => {
  const userSessionId = useSelector((state: AppState) => getUserReducer(state)[userType]?.userSessionId)
  const [deleteUserSessionMutation] = useMutation<boolean>(DELETE_USER_SESSION_MUTATION)

  const dispatch = useDispatch()
  const history = useHistory()
  const { addToast } = useToasts()

  return useCallback(async () => {
    if (!userSessionId) return null

    const { data: successful } = await deleteUserSessionMutation({
      variables: {
        userSessionId,
      },
    })
    if (successful) {
      UserActions.logout(userType)(dispatch)
      addToast(logoutMessage || "Successfully logged out!", {
        appearance: messageAppearance || "success",
        autoDismiss: true,
      })
      history.push(`${userType === "ADMIN" ? "/admin" : ""}/login`)
    }
  }, [addToast, deleteUserSessionMutation, dispatch, history, logoutMessage, messageAppearance, userSessionId, userType])
}

export default useLogout