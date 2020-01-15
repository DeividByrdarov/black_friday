import React, { useEffect } from "react"
import { useQuery } from "@apollo/react-hooks"
import { Typography, Container, Grid } from "@material-ui/core"

import ProductItem from "./ProductItem/ProductItem"
import Loading from "../../../components/Loading/Loading"
import { productsQueryData, PRODUCTS_QUERY } from "../../../graphql/product/products"

const Products: React.FC = () => {
  const { data, loading, error, refetch } = useQuery<productsQueryData>(PRODUCTS_QUERY)

  useEffect(() => {
    refetch()
  }, [])

  return (
    <Container>
      {loading && <Loading />}
      <Typography variant="h4" align="center" paragraph>Products</Typography>
      {error && <Typography color="error">{error.graphQLErrors[0].message}</Typography>}

      <Container maxWidth="md">
        <Grid container spacing={3}>
          {data?.products.map(product => {
            if (!product.quantity) return

            return <ProductItem key={product.id} refetchProducts={refetch} product={product} />
          })}
        </Grid>
      </Container>
    </Container>
  )
}

export default Products