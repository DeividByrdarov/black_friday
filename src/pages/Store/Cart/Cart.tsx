import React, { useMemo, useCallback } from "react"
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined"
import { connect } from "react-redux"
import { Link as NavLink } from "react-router-dom"
import { useToasts } from "react-toast-notifications"
import { useMutation } from "@apollo/react-hooks"
import {
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Link,
} from "@material-ui/core"

import classes from "./Cart.module.scss"
import Product from "../../../types/Product"
import CartActions from "../../../redux/actions/CartActions"
import { AppState, MapThunkTypes } from "../../../types/Redux"
import { getCartReducer, getUserReducer } from "../../../redux/selectors"
import { CREATE_RECEIPT_MUTATION, createReceiptMutationData } from "../../../graphql/receipt/createReceipt"
import Loading from "../../../components/Loading/Loading"

const mapStateToProps = (state: AppState) => ({
  items: getCartReducer(state).items,
  userSessionId: getUserReducer(state).CUSTOMER!.userSessionId,
})

const mapDispatchToProps = {
  removeFromCart: CartActions.removeFromCart,
  clearCart: CartActions.clearCart,
}

const Cart: React.FC<ReturnType<typeof mapStateToProps> & MapThunkTypes<typeof mapDispatchToProps>> = ({ userSessionId, items, removeFromCart, clearCart }) => {
  const { addToast } = useToasts()
  const [createReceipt, { loading, error }] = useMutation<createReceiptMutationData>(CREATE_RECEIPT_MUTATION)

  const total = useMemo(() => Number(items.reduce(
    (
      acc,
      item,
    ) => acc + (item.amount * item.product.price - (item.amount * item.product.price * (item.product.discount || 0) / 100)), 0))
    .toFixed(2), [items])

  const handleCheckout = useCallback(async () => {
    const { data } = await createReceipt({
      variables: {
        userSessionId,
        items: items.map(item => ({
          amount: item.amount,
          productId: item.product.id,
        })),
      },
    })

    if (data?.createReceipt.id) {
      clearCart()
      addToast("Successfully checked out!", { appearance: "success", autoDismiss: true })
    }
  }, [clearCart, createReceipt, items, userSessionId])

  const handleRemoveItem = useCallback((item: { amount: number, product: Product }) => {
    removeFromCart(item)
    addToast(`Successfully removed item: ${item.product.name}`, { appearance: "success", autoDismiss: true })
  }, [addToast, removeFromCart])

  return (
    <>
      {loading && <Loading />}
      <Typography variant="h4" align="center" paragraph>Cart</Typography>
      {error?.graphQLErrors.map(err => (
        <Typography key={err.message} color="error">{err.message}</Typography>
      ))}
      {items.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.product.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>${Number(item.amount * item.product.price - (item.amount * item.product.price * (item.product.discount || 0) / 100))
                    .toFixed(2)} (${Number(item.product.price - (item.product.price * (item.product.discount || 0) / 100))
                    .toFixed(2)} per unit)</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item)}>
                      <DeleteOutlinedIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">${total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" align="center">
          No items in cart.{" "}
          <Link
            component={NavLink}
            to="/products"
          >
            Go add something
          </Link>
        </Typography>
      )}
      {items.length > 0 && (
        <div className={classes.actions}>
          <Button color="primary" variant="contained" onClick={handleCheckout}>Checkout</Button>
        </div>
      )}
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)