import React, { useCallback, useState } from "react"
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined"
import AddFilledIcon from "@material-ui/icons/Add"
import EditFilledIcon from "@material-ui/icons/Edit"
import { useQuery, useMutation } from "@apollo/react-hooks"
import {
  Container,
  Paper,
  Typography,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@material-ui/core"

import classes from "./Products.module.scss"
import Product from "../../../types/Product"
import ProductModal from "./ProductModal/ProductModal"
import Loading from "../../../components/Loading/Loading"
import { PRODUCTS_QUERY, productsQueryData } from "../../../graphql/product/products"
import { DELETE_PRODUCT_MUTATION, deleteProductMutationData } from "../../../graphql/product/deleteProduct"

const Products: React.FC = () => {
  const [openProductModal, setOpenProductModal] = useState(false)
  const [updateProduct, setUpdateProduct] = useState<Product | null>(null)
  const { data, loading, error, refetch } = useQuery<productsQueryData>(PRODUCTS_QUERY)
  const [deleteProduct, { loading: deleteProductLoading, error: deleteProductError }] = useMutation<deleteProductMutationData>(DELETE_PRODUCT_MUTATION)

  const handleDeleteProduct = useCallback(async (product: Product) => {
    const { data } = await deleteProduct({
      variables: {
        productId: product.id,
      },
    })

    if (data?.deleteProduct) {
      refetch()
    }
  }, [deleteProduct, refetch])

  return (
    <>
      {(loading || deleteProductLoading) && <Loading />}
      <Typography variant="h3" align="center" paragraph>Products</Typography>
      {(error || deleteProductError)?.graphQLErrors.map(err => (
        <Typography key={err.message} color="error">{err.message}</Typography>
      ))}
      <Container maxWidth="md">
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow className={classes.tableHead}>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Min Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>
                  <div className={classes.actions}>
                    Actions
                    <Button onClick={() => setOpenProductModal(true)} className={classes.addButton}>
                      <AddFilledIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.products.map(product => (
                <TableRow key={product.id}>
                  <TableCell align="center">{product.name}</TableCell>
                  <TableCell align="center">{product.description}</TableCell>
                  <TableCell align="center">
                    $ {Number(product.price)
                    .toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    $ {Number(product.minPrice)
                    .toFixed(2)}
                  </TableCell>
                  <TableCell align="center">{product.quantity}</TableCell>
                  <TableCell>
                    <div className={classes.actions}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setOpenProductModal(true)
                          setUpdateProduct(product)
                        }}
                      >
                        <EditFilledIcon />
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleDeleteProduct(product)}>
                        <DeleteOutlinedIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {openProductModal && (
        <ProductModal
          onClose={() => {
            setOpenProductModal(false)
            setUpdateProduct(null)
          }}
          refetchProducts={refetch}
          product={updateProduct!}
        />
      )}
    </>
  )
}

export default Products