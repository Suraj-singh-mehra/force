import {
  Box,
  Shelf,
  Skeleton,
  SkeletonText,
  SkeletonBox,
  Spacer,
} from "@artsy/palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useSystemContext, useTracking } from "v2/System"
import { SystemQueryRenderer } from "v2/System/Relay/SystemQueryRenderer"
import { HomeWorksByArtistsYouFollowRail_homePage } from "v2/__generated__/HomeWorksByArtistsYouFollowRail_homePage.graphql"
import { HomeWorksByArtistsYouFollowRailQuery } from "v2/__generated__/HomeWorksByArtistsYouFollowRailQuery.graphql"
import { ShelfArtworkFragmentContainer } from "v2/Components/Artwork/ShelfArtwork"
import {
  ActionType,
  ClickedArtworkGroup,
  ContextModule,
  OwnerType,
} from "@artsy/cohesion"

interface HomeWorksByArtistsYouFollowRailProps {
  homePage: HomeWorksByArtistsYouFollowRail_homePage
}

const HomeWorksByArtistsYouFollowRail: React.FC<HomeWorksByArtistsYouFollowRailProps> = ({
  homePage,
}) => {
  const { trackEvent } = useTracking()

  const results = homePage.artworkModule?.results
  if (!results || results?.length === 0) {
    return null
  }

  return (
    <Shelf>
      {results.map((artwork, index) => {
        if (!artwork) {
          return <></>
        }

        return (
          <ShelfArtworkFragmentContainer
            artwork={artwork}
            key={index}
            // TODO: Add home type to cohesion once we have tracking
            contextModule={null as any}
            hidePartnerName
            lazyLoad
            onClick={() => {
              const trackingEvent: ClickedArtworkGroup = {
                action: ActionType.clickedArtworkGroup,
                context_module: ContextModule.worksByArtistsYouFollowRail,
                context_page_owner_type: OwnerType.home,
                destination_page_owner_id: artwork.internalID,
                destination_page_owner_slug: artwork.slug,
                destination_page_owner_type: OwnerType.artwork,
                type: "thumbnail",
              }
              trackEvent(trackingEvent)
            }}
          />
        )
      })}
    </Shelf>
  )
}

const PLACEHOLDER = (
  <Skeleton>
    <Shelf>
      {[...new Array(8)].map((_, i) => {
        return (
          <Box width={200} key={i}>
            <SkeletonBox width={200} height={[200, 300, 250, 275][i % 4]} />

            <Spacer mt={1} />

            <SkeletonText variant="md">Artist Name</SkeletonText>
            <SkeletonText variant="md">Artwork Title</SkeletonText>
            <SkeletonText variant="xs">Partner</SkeletonText>
            <SkeletonText variant="xs">Price</SkeletonText>
          </Box>
        )
      })}
    </Shelf>
  </Skeleton>
)

export const HomeWorksByArtistsYouFollowRailFragmentContainer = createFragmentContainer(
  HomeWorksByArtistsYouFollowRail,
  {
    homePage: graphql`
      fragment HomeWorksByArtistsYouFollowRail_homePage on HomePage {
        artworkModule(key: FOLLOWED_ARTISTS) {
          results {
            internalID
            slug
            ...ShelfArtwork_artwork @arguments(width: 210)
          }
        }
      }
    `,
  }
)

export const HomeWorksByArtistsYouFollowRailQueryRenderer: React.FC = () => {
  const { relayEnvironment } = useSystemContext()

  return (
    <SystemQueryRenderer<HomeWorksByArtistsYouFollowRailQuery>
      lazyLoad
      environment={relayEnvironment}
      query={graphql`
        query HomeWorksByArtistsYouFollowRailQuery {
          homePage {
            ...HomeWorksByArtistsYouFollowRail_homePage
          }
        }
      `}
      placeholder={PLACEHOLDER}
      render={({ error, props }) => {
        if (error) {
          console.error(error)
          return null
        }

        if (!props) {
          return PLACEHOLDER
        }

        if (props.homePage) {
          return (
            <HomeWorksByArtistsYouFollowRailFragmentContainer
              homePage={props.homePage}
            />
          )
        }

        return null
      }}
    />
  )
}