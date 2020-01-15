import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { Typography, Container, Card, Grid, CardContent, CardActions } from "@material-ui/core"

import classes from "./Receipts.module.scss"
import Loading from "../../../components/Loading/Loading"
import { RECEIPTS_QUERY, receiptsQueryData } from "../../../graphql/receipt/receipts"

const Receipts: React.FC = () => {
  const { data, loading, error } = useQuery<receiptsQueryData>(RECEIPTS_QUERY)

  return (
    <>
      {loading && <Loading />}
      <Typography className={classes.header} variant="h3">Receipts</Typography>
      {error?.graphQLErrors.map(err => (
        <Typography key={err.message} color="error">{err.message}</Typography>
      ))}
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {data?.receipts.map(receipt => (
            <Grid key={receipt.id} item xs={4}>
              <Card>
                <CardContent>
                  {receipt.items.map(item => (
                    <div className={classes.receiptItem} key={item.product.id}>
                      <Typography variant="h6">{item.product.name}</Typography>
                      <Typography>$ {Number(item.amount * item.product.price - (item.amount * item.product.price * (item.product.discount || 0) / 100))
                        .toFixed(2)}</Typography>
                    </div>
                  ))}
                </CardContent>
                <CardActions className={classes.actions}>
                  <Typography>User: {receipt.user.username}</Typography>
                  <Typography variant="h6">Total: $ {Number(receipt.total)
                    .toFixed(2)}</Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export default Receipts