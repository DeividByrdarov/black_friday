import React, { useEffect } from "react"
import RemoveFilledIcon from "@material-ui/icons/Remove"
import { ListItem, ListItemText, ListItemSecondaryAction, TextField, Typography, IconButton } from "@material-ui/core"

import classes from "./DiscountItem.module.scss"
import Product from "../../../../../types/Product"
import DiscountItem from "../../../../../types/DiscountItem"
import { useStateForInput } from "../../../../../hooks"

type Props = {
  item: DiscountItem
  updateDiscount: ({ product, discount }: { product: Product, discount: number }) => void
  removeProduct: (productId: string) => void
}

const DisplayDiscountItem: React.FC<Props> = ({ item, updateDiscount, removeProduct }) => {
  const [discount, setDiscount] = useStateForInput(item.discount || 0)

  useEffect(() => {
    updateDiscount({ product: item.product, discount: Number(discount) })
  }, [discount])

  return (
    <ListItem style={{ marginTop: "2rem" }}>
      <ListItemText primary={item.product.name} secondary={item.product.description} />
      <ListItemSecondaryAction>
        <div className={classes.actions}>
          <div>
            <TextField
              type="number"
              name="discount"
              id="discount"
              placeholder="Discount in %"
              value={discount}
              onChange={setDiscount}
            />
            <Typography>Discounted price: {Number(item.product.price - (item.product.price * Number(discount) / 100))
              .toFixed(2)}</Typography>
            <Typography>
              (max discount in %: {Number((item.product.price - item.product.minPrice) / item.product.price * 100)
              .toFixed(2)})
            </Typography>
          </div>
          <div className={classes.buttonWrapper}>
            <IconButton onClick={() => removeProduct(item.product.id)} className={classes.removeButton}>
              <RemoveFilledIcon />
            </IconButton>
          </div>
        </div>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default DisplayDiscountItem