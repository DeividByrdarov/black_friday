import React, { useCallback, useEffect, useState } from "react"
import { useQuery } from "@apollo/react-hooks"
import { Typography, Grid, Card, CardContent, Container, Button } from "@material-ui/core"

import classes from "./Campaigns.module.scss"
import Campaign from "../../../types/Campaign"
import Loading from "../../../components/Loading/Loading"
import { CAMPAIGNS_QUERY, campaignsQueryData } from "../../../graphql/campaign/campaigns"
import { RouteComponentProps } from "react-router-dom"
import SingleCampaign from "./SingleCampaign/SingleCampaign"
import { PRODUCTS_QUERY, productsQueryData } from "../../../graphql/product/products"

const Campaigns: React.FC<RouteComponentProps<{ id?: string }>> = ({ history, match }) => {
  const [campaign, setCampaign] = useState<Campaign | undefined>()
  const [newCampaign, setNewCampaign] = useState(false)
  const { data: campaignsData, loading: campaignsLoading, error: campaignsError, refetch } = useQuery<campaignsQueryData>(CAMPAIGNS_QUERY)
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery<productsQueryData>(PRODUCTS_QUERY)

  useEffect(() => {
    if (match.params.id) {
      setCampaign(campaignsData?.campaigns.find(campaign => campaign.id === match.params.id))
    }
  }, [campaignsData, match.params])

  const openCampaign = useCallback((campaign: Campaign) => {
    history.push(`/admin/campaigns/${campaign.id}`)
  }, [history])

  return (
    <div>
      {(campaignsLoading || productsLoading) && <Loading />}
      <Typography variant="h3" align="center" className={classes.heading}>Campaigns</Typography>
      {(campaignsError || productsError)?.graphQLErrors.map(err => (
        <Typography key={err.message} color="error">{err.message}</Typography>
      ))}
      {(campaign || newCampaign) &&
      <SingleCampaign
        refetchCampaigns={refetch}
        campaign={campaign}
        products={productsData?.products!}
        clearCurrentCampaign={() => {
          setCampaign(null)
          setNewCampaign(false)
        }}
      />}
      <Container maxWidth="lg" className={classes.newButton}>
        <Button onClick={() => setNewCampaign(true)}>New</Button>
      </Container>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {campaignsData?.campaigns.filter(camp => campaign?.id !== camp.id)
            .map(campaign => (
              <Grid key={campaign.id} item xs={4}>
                <Card onClick={() => openCampaign(campaign)} className={classes.card}>
                  <CardContent>
                    <div className={`${classes.circle} ${campaign.active ? classes.active : null}`} />
                    <Typography variant="h6">{campaign.name}</Typography>
                    <Typography>{campaign.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  )
}

export default Campaigns