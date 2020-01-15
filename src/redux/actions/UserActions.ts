import { Dispatch } from "redux"

import UserSession from "../../types/UserSession"
import { Role } from "../../types/User"
import { actionCreator, createRequestTypes } from "."

export const LOGIN = createRequestTypes("LOGIN")
export const LOGOUT = createRequestTypes("LOGOUT")

export default class UserActions {
  public static login = (userSession: UserSession) => (dispatch: Dispatch) => {
    dispatch(actionCreator.internal(LOGIN, userSession))
  }

  public static logout = (role: Role) => (dispatch: Dispatch) => {
    dispatch(actionCreator.internal(LOGOUT, role))
  }
}