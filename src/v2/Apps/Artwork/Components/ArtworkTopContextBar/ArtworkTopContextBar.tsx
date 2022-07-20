import { ArtworkTopContextBar_artwork } from "v2/__generated__/ArtworkTopContextBar_artwork.graphql"
import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Box, Column, GridColumns } from "@artsy/palette"
import { TopContextBar } from "v2/Components/TopContextBar"

export interface ArtworkTopContextBarProps {
  artwork: ArtworkTopContextBar_artwork
}

export const ArtworkTopContextBar: React.FC<ArtworkTopContextBarProps> = props => {
  const bannerProps = computeBannerProps(props)

  if (!bannerProps) {
    return null
  }

  const { image, meta, name, subHeadline, href } = bannerProps
  const isShow = props.artwork?.context?.__typename === "Show"

  return (
    <TopContextBar
      href={href}
      displayBackArrow={isShow}
      src={!isShow ? image : undefined}
    >
      <GridColumns>
        <Column span={8}>
          {[name, subHeadline].filter(Boolean).join(" - ")}　
          <Box as="span" display="inline-block" color="black60">
            {meta}
          </Box>
        </Column>
      </GridColumns>
    </TopContextBar>
  )
}

const computeBannerProps = (props: ArtworkTopContextBarProps) => {
  const { context, partner, sale } = props.artwork

  if (!context) {
    return null
  }

  switch (context.__typename) {
    case "Sale": {
      if (!sale) {
        return null
      }

      return {
        image: sale.coverImage?.url,
        meta: "In auction",
        name: context.name,
        subHeadline:
          sale.isBenefit || sale.isGalleryAuction ? null : partner?.name,
        href: context.href,
      }
    }
    case "Fair": {
      return {
        image: context.profile?.icon?.url,
        meta: "At fair",
        name: context.name,
        subHeadline: partner?.name,
        href: context.href,
      }
    }
    case "Show": {
      let meta = "In current show"
      if (context.status === "upcoming") {
        meta = "In upcoming show"
      } else if (context.status === "closed") {
        meta = "In past show"
      }

      return {
        image: context.thumbnail?.url,
        meta,
        name: context.name,
        subHeadline: partner?.name,
        href: context.href,
      }
    }
    default: {
      return null
    }
  }
}

export const ArtworkTopContextBarFragmentContainer = createFragmentContainer(
  ArtworkTopContextBar,
  {
    artwork: graphql`
      fragment ArtworkTopContextBar_artwork on Artwork {
        partner {
          name
        }
        sale {
          isAuction
          isBenefit
          isGalleryAuction
          coverImage {
            url
          }
        }
        context {
          __typename
          ... on Sale {
            name
            href
          }
          ... on Fair {
            name
            href
            profile {
              icon {
                url
              }
            }
          }
          ... on Show {
            name
            href
            status
            thumbnail: coverImage {
              url
            }
          }
        }
      }
    `,
  }
)