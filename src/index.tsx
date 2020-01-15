import React from "react"
import ReactDOM from "react-dom"
import ApolloClient from "apollo-boost"
import { Provider } from "react-redux"
// @ts-ignore
import { PersistGate } from "redux-persist/integration/react"
import { ApolloProvider } from "@apollo/react-hooks"
import { ToastProvider } from "react-toast-notifications"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import * as serviceWorker from "./serviceWorker"
import Loading from "./components/Loading/Loading"
import Admin from "./pages/Admin/Admin"
import Store from "./pages/Store/Store"
import store, { persistor } from "./store"

import "./index.scss"

const client = new ApolloClient({
  uri: process.env.BACKEND_URL || "http://localhost:8080/graphql",
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Loading />}>
        <ToastProvider placement="bottom-right" autoDismissTimeout={3000}>
          <Router>
            <Switch>
              <Route path="/admin" component={Admin} />
              <Route path="/" component={Store} />
            </Switch>
          </Router>
        </ToastProvider>
      </PersistGate>
    </Provider>
  </ApolloProvider>
  , document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
