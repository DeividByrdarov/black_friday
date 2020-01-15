import thunk from "redux-thunk"
import { persistStore } from "redux-persist"
import { createStore, applyMiddleware, compose } from "redux"

import rootReducer from "./redux/reducers"

const devTools = process.env.NODE_ENV === "development" ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : null

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    devTools,
  ),
)

export const persistor = persistStore(store)

export default store