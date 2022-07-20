import express from "express"
import { fetchQuery } from "relay-runtime"
import { createRelaySSREnvironment } from "v2/System/Relay/createRelaySSREnvironment"
import { RSS_ARTICLES_QUERY } from "./queries/RssArticlesQuery"
import { RssArticlesQuery } from "v2/__generated__/RssArticlesQuery.graphql"
import { extractNodes } from "v2/Utils/extractNodes"
import { getENV } from "v2/Utils/getENV"
import {
  ARTSY_EDITORIAL_CHANNEL,
  GALLERY_PARTNER_UPDATES_CHANNEL,
} from "config"

const rssServerApp = express()

rssServerApp.set("views", `${__dirname}/templates`)
rssServerApp.set("view engine", "ejs")

rssServerApp.get("/rss/news", async (req, res) => {
  const relayEnvironment = createRelaySSREnvironment({
    userAgent: req.header("User-Agent"),
  })

  const { articlesConnection } = await fetchQuery<RssArticlesQuery>(
    relayEnvironment,
    RSS_ARTICLES_QUERY,
    { channelId: ARTSY_EDITORIAL_CHANNEL }
  )

  const articles = extractNodes(articlesConnection)

  res.set("Content-Type", "application/rss+xml")
  res.render("news", {
    appUrl: getENV("APP_URL"),
    articles,
  })
})

rssServerApp.get("/rss/partner-updates", async (req, res) => {
  const relayEnvironment = createRelaySSREnvironment({
    userAgent: req.header("User-Agent"),
  })

  const { articlesConnection } = await fetchQuery<RssArticlesQuery>(
    relayEnvironment,
    RSS_ARTICLES_QUERY,
    { channelId: GALLERY_PARTNER_UPDATES_CHANNEL }
  )

  const articles = extractNodes(articlesConnection)

  res.set("Content-Type", "application/rss+xml")
  res.render("partnerUpdates", {
    appUrl: getENV("APP_URL"),
    articles,
  })
})

export { rssServerApp }