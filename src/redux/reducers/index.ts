import storage from "redux-persist/es/storage"
import { persistReducer } from "redux-persist"
import { combineReducers } from "redux"

import userReducer from "./userReducer"
import cartReducer from "./cartReducer"

const rootReducer = combineReducers({ userReducer, cartReducer })

export default persistReducer({
  storage,
  key: "user",
  whitelist: ["userReducer"],
}, rootReducer)