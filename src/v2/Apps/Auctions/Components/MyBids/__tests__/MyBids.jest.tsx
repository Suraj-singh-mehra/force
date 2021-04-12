import React from "react"
import { graphql } from "relay-runtime"
import { setupTestWrapper } from "v2/DevTools/setupTestWrapper"
import { MyBidsFragmentContainer } from "../MyBids"
import { useTracking as baseUseTracking } from "react-tracking"

jest.mock("react-tracking")
jest.unmock("react-relay")

describe("MyBids", () => {
  const useTracking = baseUseTracking as jest.Mock
  const trackEvent = jest.fn()

  const { getWrapper } = setupTestWrapper({
    Component: (props: any) => {
      return <MyBidsFragmentContainer me={props.me} />
    },
    query: graphql`
      query MyBids_Test_Query {
        me {
          ...MyBids_me
        }
      }
    `,
  })

  beforeEach(() => {
    useTracking.mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the correct components", () => {
    const wrapper = getWrapper()
    expect(wrapper.find("CarouselRail")).toBeDefined()
    expect(wrapper.find("SaleContainer")).toBeDefined()
    expect(wrapper.find("MyBidsBidHeaderFragmentContainer")).toBeDefined()
    expect(wrapper.find("MyBidsBidItemFragmentContainer")).toBeDefined()
  })
})
