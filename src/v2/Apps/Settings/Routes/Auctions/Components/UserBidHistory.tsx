import { Box, Column, Flex, GridColumns, Text } from "@artsy/palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { RouterLink } from "v2/System/Router/RouterLink"
import { UserBidHistory_me } from "v2/__generated__/UserBidHistory_me.graphql"

interface UserBidHistoryProps {
  me: UserBidHistory_me
}

export const UserBidHistory: React.FC<UserBidHistoryProps> = ({ me }) => {
  const myBids = me?.myBids

  return (
    <Box mt={16} mb={16} borderBottom="1px solid" borderColor="black10">
      <Text variant={["sm", "lg"]} mt={4} mb={[2, 4]}>
        Bid History
      </Text>

      {myBids?.closed?.length ? (
        <GridColumns mb={6}>
          {myBids.closed.map((bid, i) => (
            <Column
              key={i}
              span={8}
              pb={2}
              display="flex"
              borderBottom={
                myBids?.closed?.length && i + 1 < myBids?.closed?.length
                  ? "1px solid"
                  : ""
              }
              borderColor="black10"
            >
              <Flex flexDirection="column">
                <RouterLink to={bid?.sale?.href ?? ""}>
                  <Text color="black80" variant="sm">
                    {bid?.sale?.name}
                  </Text>
                </RouterLink>

                <Text color="black60" variant="xs">
                  {bid?.sale?.profile?.bio}
                </Text>

                <Text color="black60" variant="xs">
                  Ended at: {bid?.sale?.endAt}
                </Text>
              </Flex>
            </Column>
          ))}
        </GridColumns>
      ) : (
        <Text mb={4} color="black60" variant="sm">
          Nothing to Show
        </Text>
      )}
    </Box>
  )
}

export const UserBidHistoryFragmentContainer = createFragmentContainer(
  UserBidHistory,
  {
    me: graphql`
      fragment UserBidHistory_me on Me {
        myBids {
          closed {
            sale {
              name
              href
              endAt(format: "MMMM D, h:mmA")
              profile {
                bio
              }
            }
          }
        }
      }
    `,
  }
)
