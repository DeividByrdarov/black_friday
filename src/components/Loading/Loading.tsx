import React from "react"
import { LinearProgress } from "@material-ui/core"

import classes from "./Loading.module.scss"

const Loading: React.FC = () => {
  return (
    <LinearProgress className={classes.indicator} variant="query" color="secondary" />
  )
}

export default Loading