import React, { useCallback } from "react"
import { useMutation } from "@apollo/react-hooks"
import { useToasts } from "react-toast-notifications"
import { ApolloQueryResult } from "apollo-client/core/types"
import { Typography, TextField, Button } from "@material-ui/core"

import classes from "./ProductModal.module.scss"
import Product from "../../../../types/Product"
import Modal from "../../../../components/Modal/Modal"
import Loading from "../../../../components/Loading/Loading"
import { useStateForInput } from "../../../../hooks"
import { productsQueryData } from "../../../../graphql/product/products"
import { createProductMutationData, CREATE_PRODUCT_MUTATION } from "../../../../graphql/product/createProduct"
import { updateProductMutationData, UPDATE_PRODUCT_MUTATION } from "../../../../graphql/product/updateProduct"

type Props = {
  onClose: () => void
  product?: Product
  refetchProducts: () => Promise<ApolloQueryResult<productsQueryData>>
}

const ProductModal: React.FC<Props> = ({ onClose, product, refetchProducts }) => {
  const [name, setName] = useStateForInput(product?.name || "")
  const [description, setDescription] = useStateForInput(product?.description || "")
  const [price, setPrice] = useStateForInput(product?.price || 0)
  const [minPrice, setMinPrice] = useStateForInput(product?.minPrice || 0)
  const [quantity, setQuantity] = useStateForInput(product?.quantity || 0)

  const { addToast } = useToasts()
  const [createProduct, { loading: createLoading, error: createErrors }] = useMutation<createProductMutationData>(CREATE_PRODUCT_MUTATION)
  const [updateProduct, { loading: updateLoading, error: updateErrors }] = useMutation<updateProductMutationData>(UPDATE_PRODUCT_MUTATION)

  const handleSave = useCallback(async () => {
    if (Number(minPrice) > Number(price)) {
      addToast("Minimal price should be less than the actual price!", { appearance: "warning", autoDismiss: true })
      return
    }

    let data

    if (product) {
      const response = await updateProduct({
        variables: {
          ...product,
          name,
          description,
          price,
          minPrice,
          quantity,
        },
      })

      data = response.data?.updateProduct
    } else {
      const response = await createProduct({
        variables: {
          name,
          description,
          price,
          minPrice,
          quantity,
        },
      })

      data = response.data?.createProduct
    }

    if (data?.id) {
      refetchProducts()
      onClose()
    }
  }, [addToast, createProduct, description, minPrice, name, onClose, price, product, quantity, refetchProducts, updateProduct])

  return (
    <Modal onClose={onClose}>
      {(createLoading || updateLoading) && <Loading />}
      <div className={classes.wrapper}>
        <Typography align="center" variant="h4">{product ? "Edit" : "New"} Product</Typography>
        {(createErrors || updateErrors)?.graphQLErrors.map(err => (
          <Typography key={err.message} color="error">{err.message}</Typography>
        ))}
        <div className={classes.field}>
          <Typography component="label" htmlFor="name" align="center">Name</Typography>
          <TextField
            variant="outlined"
            placeholder="Enter name..."
            name="name"
            id="name"
            value={name}
            onChange={setName}
          />
        </div>
        <div className={classes.field}>
          <Typography component="label" htmlFor="description" align="center">Description</Typography>
          <TextField
            variant="outlined"
            placeholder="Enter description..."
            name="description"
            id="description"
            value={description}
            onChange={setDescription}
          />
        </div>
        <div className={classes.field}>
          <Typography component="label" htmlFor="price" align="center">Price</Typography>
          <TextField
            type="number"
            variant="outlined"
            placeholder="Enter price..."
            name="price"
            id="price"
            value={price}
            onChange={setPrice}
          />
        </div>
        <div className={classes.field}>
          <Typography component="label" htmlFor="minPrice" align="center">Minimial Price</Typography>
          <TextField
            type="number"
            variant="outlined"
            placeholder="Enter minimal price..."
            name="minPrice"
            id="minPrice"
            value={minPrice}
            onChange={setMinPrice}
          />
        </div>
        <div className={classes.field}>
          <Typography component="label" htmlFor="quantity" align="center">Quantity</Typography>
          <TextField
            variant="outlined"
            placeholder="Enter quantity..."
            name="quantity"
            id="quantity"
            value={quantity}
            onChange={setQuantity}
          />
        </div>
        <div className={classes.actions}>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ProductModal