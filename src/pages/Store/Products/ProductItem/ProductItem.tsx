import React, { useCallback } from "react"
import { connect } from "react-redux"
import { ApolloQueryResult } from "apollo-client/core/types"
import { Grid, Card, CardContent, Typography, CardActions, Button, TextField } from "@material-ui/core"

import classes from "./ProductItem.module.scss"
import Product from "../../../../types/Product"
import CartActions from "../../../../redux/actions/CartActions"
import { useStateForInput } from "../../../../hooks"
import { MapThunkTypes, AppState } from "../../../../types/Redux"
import { useToasts } from "react-toast-notifications"
import { useMutation } from "@apollo/react-hooks"
import { getUserReducer } from "../../../../redux/selectors"
import { productsQueryData } from "../../../../graphql/product/products"
import { CREATE_RECEIPT_MUTATION, createReceiptMutationData } from "../../../../graphql/receipt/createReceipt"

const mapDispatchToProps = {
  addToCart: CartActions.addToCart,
}

const mapStateToProps = (state: AppState) => ({
  userSessionId: getUserReducer(state).CUSTOMER?.userSessionId,
})

type Props = ReturnType<typeof mapStateToProps> & MapThunkTypes<typeof mapDispatchToProps> & {
  product: Product
  refetchProducts: () => Promise<ApolloQueryResult<productsQueryData>>
}

const ProductItem: React.FC<Props> = ({ refetchProducts, product, userSessionId, addToCart }) => {
  const { addToast } = useToasts()
  const [amount, setAmount] = useStateForInput("")
  const [createReceipt] = useMutation<createReceiptMutationData>(CREATE_RECEIPT_MUTATION)

  const isValid = useCallback(() => {
    if (product.quantity < Number(amount)) {
      addToast("Not enough quantity of this product in stock!", { appearance: "warning", autoDismiss: true })
      return false
    }

    if (!Number(amount) || Number(amount) === 0) {
      addToast("Enter amount!", { appearance: "warning", autoDismiss: true })
      return false
    }

    return true
  }, [addToast, amount, product.quantity])

  const handleAddToCart = useCallback(() => {
    if (!isValid()) {
      return
    }

    addToCart(product, Number(amount))
    addToast(`Successfully added ${amount} of ${product.name}`, { appearance: "success", autoDismiss: true })
  }, [addToCart, addToast, amount, product])

  const handleBuy = useCallback(async () => {
    if (!isValid()) {
      return
    }

    const { data } = await createReceipt({
      variables: {
        userSessionId,
        items: [
          {
            amount,
            productId: product.id,
          },
        ],
      },
    })

    if (data?.createReceipt.id) {
      refetchProducts()
      addToast(`Successfully bought ${amount} of ${product.name}`, { appearance: "success", autoDismiss: true })
    }
  }, [addToast, amount, createReceipt, isValid, product.id, product.name, refetchProducts, userSessionId])

  return (
    <Grid item xs={6}>
      <Card key={product.id}>
        <CardContent>
          <div className={classes.cardContent}>
            <div>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body1">{product.description}</Typography>
            </div>
            <div>
              <Typography className={product.discount ? classes.crossed : undefined}>$ {Number(product.price)
                .toFixed(2)}</Typography>
              {product.discount && (
                <Typography>$ {Number(product.price - (product.price * product.discount / 100))
                  .toFixed(2)}</Typography>
              )}
              <Typography>{product.quantity} left</Typography>
            </div>
          </div>
        </CardContent>
        {userSessionId && (
          <CardActions className={classes.actions}>
            <TextField placeholder="Enter amount" type="number" size="small" onChange={setAmount} />
            <Button color="primary" variant="contained" onClick={handleAddToCart}>Add to Cart</Button>
            <Button color="secondary" variant="contained" onClick={handleBuy}>Buy</Button>
          </CardActions>
        )}
      </Card>
    </Grid>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem)