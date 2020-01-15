import React, { useCallback, useState, useEffect } from "react"
import { useMutation } from "@apollo/react-hooks"
import { useToasts } from "react-toast-notifications"
import { ApolloQueryResult } from "apollo-client/core/types"
import { Typography, Paper, Container, Button, List, Select, MenuItem, TextField } from "@material-ui/core"

import classes from "./SingleCampaign.module.scss"
import Product from "../../../../types/Product"
import Campaign from "../../../../types/Campaign"
import DiscountItem from "../../../../types/DiscountItem"
import Loading from "../../../../components/Loading/Loading"
import DisplayDiscountItem from "./DiscountItem/DiscountItem"
import { useStateForInput } from "../../../../hooks"
import { campaignsQueryData } from "../../../../graphql/campaign/campaigns"
import { UPDATE_CAMPAIGN_MUTATION, updateCampaignMutationData } from "../../../../graphql/campaign/updateCampaign"
import { CREATE_CAMPAIGN_MUTATION, createCampaignMutationData } from "../../../../graphql/campaign/createCampaign"
import { DELETE_CAMPAIGN_MUTATION, deleteCampaignMutationData } from "../../../../graphql/campaign/deleteCampaign"

type Props = {
  campaign?: Campaign
  products: Product[]
  refetchCampaigns: () => Promise<ApolloQueryResult<campaignsQueryData>>
  clearCurrentCampaign: () => void
}

const SingleCampaign: React.FC<Props> = ({ campaign, products, refetchCampaigns, clearCurrentCampaign }) => {
  const [name, setName, customSetName] = useStateForInput(campaign?.name)
  const [editName, setEditName] = useState(!campaign)
  const [description, setDescription, customSetDescription] = useStateForInput(campaign?.description)
  const [editDescription, setEditDescription] = useState(!campaign)
  const [active, setActive] = useState(campaign?.active || false)
  const [discounts, setDiscounts] = useState<DiscountItem[]>(campaign?.items || [])
  const [selectedProduct, setSelectedProduct] = useState("")

  const [updateCampaign, { loading: updateLoading, error: updateError }] = useMutation<updateCampaignMutationData>(UPDATE_CAMPAIGN_MUTATION)
  const [createCampaign, { loading: createLoading, error: createError }] = useMutation<createCampaignMutationData>(CREATE_CAMPAIGN_MUTATION)
  const [deleteCampaign, { loading: deleteLoading, error: deleteError }] = useMutation<deleteCampaignMutationData>(DELETE_CAMPAIGN_MUTATION)

  const { addToast } = useToasts()

  useEffect(() => {
    customSetName(campaign?.name || "")
    setEditName(!campaign)
    customSetDescription(campaign?.description || "")
    setEditDescription(!campaign)
    setActive(campaign?.active || false)
    setDiscounts(campaign?.items || [])
    setSelectedProduct("")
  }, [campaign])

  const handleDiscountUpdate = useCallback(({ product, discount }) => {
    if (discounts.find((disc) => disc.product.id === product.id)) {
      setDiscounts(discounts.map(disc => disc.product.id === product.id ? { ...disc, discount } : disc))
    } else {
      setDiscounts([
        ...discounts,
        {
          product,
          discount,
        },
      ])
    }
  }, [discounts])

  const handleDelete = useCallback(async () => {
    if (campaign?.id) {
      const { data } = await deleteCampaign({
        variables: {
          campaignId: campaign?.id,
        },
      })

      if (data?.deleteCampaign) {
        refetchCampaigns()
        addToast(`Successfully deleted campaign!`, {
          appearance: "success",
          autoDismiss: true,
        })
      }
    }

    clearCurrentCampaign()
  }, [addToast, campaign, clearCurrentCampaign, deleteCampaign, refetchCampaigns])

  const handleSave = useCallback(async () => {
    let data
    if (campaign) {
      const response = await updateCampaign({
        variables: {
          id: campaign.id,
          name,
          description,
          active,
          items: discounts.map(discount => ({
            discount: discount.discount,
            productId: discount.product.id,
          })),
        },
      })

      data = response.data?.updateCampaign
    } else {
      const response = await createCampaign({
        variables: {
          name,
          description,
          active,
          items: discounts.map(discount => ({
            discount: discount.discount,
            productId: discount.product.id,
          })),
        },
      })

      data = response.data?.createCampaign
    }

    if (data?.id) {
      addToast(`Successfully ${campaign ? "updated" : "created"} campaign!`, {
        appearance: "success",
        autoDismiss: true,
      })
      refetchCampaigns()
    }
  }, [active, addToast, campaign, createCampaign, description, discounts, name, refetchCampaigns, updateCampaign])

  // @ts-ignore
  return (
    <Container className={classes.wrapper} maxWidth="lg">
      {(createLoading || updateLoading || deleteLoading) && <Loading />}
      <Paper elevation={12}>
        <div className={classes.actions}>
          <Button onClick={clearCurrentCampaign}>
            Close
          </Button>
          <Button onClick={handleSave} className={classes.saveButton}>
            Save
          </Button>
          <Button onClick={handleDelete} className={classes.deleteButton}>
            Delete
          </Button>
        </div>
        {(createError || updateError || deleteError)?.graphQLErrors.map(err => (
          <Typography key={err.message} color="error">{err.message}</Typography>
        ))}
        {editName ? (
          <TextField
            name="name"
            id="name"
            value={name}
            onChange={setName}
            onBlur={() => name ? setEditName(false) : null}
          />
        ) : (
          <Typography onDoubleClick={() => setEditName(true)} variant='h4'>
            {name}{" "}
          </Typography>
        )}
        <Typography
          onDoubleClick={() => setActive(!active)}
          variant="body1"
          className={active ? classes.active : classes.inactive}
        >
          ({active ? "active" : "inactive"})
        </Typography>
        {editDescription ? (
          <TextField
            multiline
            fullWidth
            name="description"
            id="description"
            value={description}
            onChange={setDescription}
            onBlur={() => description ? setEditDescription(false) : null}
          />
        ) : (
          <Typography onDoubleClick={() => setEditDescription(true)}>{description}</Typography>
        )}
        <div className={classes.addProduct}>
          <Select
            name="product"
            id="product"
            variant="outlined"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value as string)}
          >
            {products?.filter(product => discounts.findIndex(item => item.product.id === product.id) === -1)
              .map(product => (
                <MenuItem value={product.id}>{product.name}</MenuItem>
              ))}
          </Select>
          <Button
            onClick={() => {
              if (!selectedProduct) return
              setDiscounts([
                ...discounts,
                {
                  product: products.find(product => product.id === selectedProduct)!,
                  discount: 0,
                },
              ])
            }}
            className={classes.addButton}
          >
            Add
          </Button>
        </div>
        <List style={{ display: "flex", flexDirection: "column" }}>
          {discounts.map(item => (
            <DisplayDiscountItem
              key={item.product.id}
              item={item}
              updateDiscount={handleDiscountUpdate}
              removeProduct={(productId) => setDiscounts(discounts.filter(discount => discount.product.id !== productId))}
            />
          ))}
        </List>
      </Paper>
    </Container>
  )
}

export default SingleCampaign