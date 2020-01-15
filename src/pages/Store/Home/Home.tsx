import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { Typography } from "@material-ui/core"

import classes from "./Home.module.scss"
import Loading from "../../../components/Loading/Loading"
import { ACTIVE_CAMPAIGN_QUERY, activeCampaignQueryData } from "../../../graphql/campaign/getActiveCampaign"

type Props = {}

const Home: React.FC<Props> = () => {
  const { data, loading, error } = useQuery<activeCampaignQueryData>(ACTIVE_CAMPAIGN_QUERY)

  return (
    <>
      {loading && <Loading />}
      <Typography variant="h3" align="center">Home</Typography>
      <Typography variant="h6" align="center">Hello to my web store. Here you have a variety of products to choose from
        😉</Typography>
      {data && data.activeCampaign && (
        <div className={classes.campaign}>
          <Typography>Currently we are having a campaign called {data.activeCampaign.name}</Typography>
          <Typography>{data.activeCampaign.description}</Typography>
        </div>
      )}
    </>
  )
}

export default Home