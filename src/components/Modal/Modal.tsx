import React from "react"
import CloseFilledIcon from "@material-ui/icons/Close"

import classes from "./Modal.module.scss"

type Props = {
  onClose: () => void
}

const Modal: React.FC<Props> = ({ children, onClose }) => {
  return (
    <>
      <div className={classes.background} onClick={onClose} />
      <div className={classes.content}>
        <CloseFilledIcon className={classes.closeButton} onClick={onClose} />
        {children}
      </div>
    </>
  )
}

export default Modal