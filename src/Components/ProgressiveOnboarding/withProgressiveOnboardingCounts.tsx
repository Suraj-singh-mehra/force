import { ComponentType } from "react"
import { graphql } from "react-relay"
import { SystemQueryRenderer } from "System/Relay/SystemQueryRenderer"
import { useSystemContext } from "System/SystemContext"
import { withProgressiveOnboardingCountsQuery } from "__generated__/withProgressiveOnboardingCountsQuery.graphql"

export interface WithProgressiveOnboardingCountsProps {
  counts: {
    isReady: boolean
    followedArtists: number
    savedArtworks: number
    savedSearches: number
  }
}

const INITIAL_COUNTS = {
  isReady: false,
  followedArtists: 0,
  savedArtworks: 0,
  savedSearches: 0,
}

export const withProgressiveOnboardingCounts = <
  T extends WithProgressiveOnboardingCountsProps
>(
  Component: ComponentType<T & WithProgressiveOnboardingCountsProps>
): ComponentType<Omit<T, "counts">> => {
  return (props: T) => {
    const { isLoggedIn } = useSystemContext()

    if (!isLoggedIn) {
      return <Component {...props} counts={INITIAL_COUNTS} />
    }

    return (
      <SystemQueryRenderer<withProgressiveOnboardingCountsQuery>
        lazyLoad
        placeholder={<Component {...props} counts={INITIAL_COUNTS} />}
        query={graphql`
          query withProgressiveOnboardingCountsQuery {
            me {
              counts {
                followedArtists
                savedArtworks
                savedSearches
              }
            }
          }
        `}
        render={({ props: renderProps, error }) => {
          if (error || !renderProps?.me) {
            console.error(error)
            return <Component {...props} counts={INITIAL_COUNTS} />
          }

          const counts = renderProps.me.counts || INITIAL_COUNTS

          return <Component {...props} counts={{ isReady: true, ...counts }} />
        }}
      />
    )
  }
}