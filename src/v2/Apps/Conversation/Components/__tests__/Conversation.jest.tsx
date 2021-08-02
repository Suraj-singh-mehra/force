import React from "react"
import { ConversationPaginationContainer } from "../Conversation"
import {
  InquiryImage,
  MockedInquiryConversation,
} from "v2/Apps/__tests__/Fixtures/Conversation"
import { MockBoot, renderRelayTree } from "v2/DevTools"
import { graphql } from "react-relay"
import {
  ConversationPaginationTestQueryRawResponse,
  ConversationPaginationTestQueryResponse,
} from "v2/__generated__/ConversationPaginationTestQuery.graphql"
import { useTracking } from "react-tracking"
import { SystemContextProvider } from "v2/System"
import { HeadProvider } from "react-head"

jest.unmock("react-relay")

const render = (
  node: ConversationPaginationTestQueryRawResponse["node"],
  user: User
) =>
  renderRelayTree({
    Component: (props: ConversationPaginationTestQueryResponse) => {
      return (
        // @ts-expect-error STRICT_NULL_CHECK
        <ConversationPaginationContainer
          {...props}
          conversation={props.node!}
        />
      )
    },
    mockData: {
      node,
      artwork: InquiryImage,
    },
    query: graphql`
      query ConversationPaginationTestQuery {
        node(id: "whatever") {
          ...Conversation_conversation @arguments(count: 10, after: "whatever")
        }
      }
    `,
    wrapper: children => (
      <MockBoot>
        <HeadProvider>
          <SystemContextProvider user={user}>{children}</SystemContextProvider>
        </HeadProvider>
      </MockBoot>
    ),
    mockMutationResults: {
      updateConversation: {
        conversation: {
          id: "whatever",
          unread: false,
        },
      },
    },
  })

describe("Conversation", () => {
  const mockuseTracking = useTracking as jest.Mock
  const trackingSpy = jest.fn()

  beforeEach(() => {
    mockuseTracking.mockImplementation(() => ({
      trackEvent: trackingSpy,
    }))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("when user has Inquiry Checkout feature and the artwork is offerable", () => {
    const userMock = {
      type: "NotAdmin",
      lab_features: ["Web Inquiry Checkout"],
    }

    it("shows the buyer guarantee message", async () => {
      const conversation = await render(MockedInquiryConversation, userMock)
      console.log(conversation)
      const buyerGuaranteeMessage = conversation.find("BuyerGuaranteeMessage")

      expect(buyerGuaranteeMessage).toHaveLength(1)
    })

    it("renders the confirm artwork modal query renderer", async () => {
      const conversation = await render(MockedInquiryConversation, userMock)
      const queryRenderer = conversation.find(
        "ConfirmArtworkModalQueryRenderer"
      )

      expect(queryRenderer).toHaveLength(1)
    })

    it("renders the OrderModal", async () => {
      const conversation = await render(MockedInquiryConversation, userMock)
      const orderModal = conversation.find("OrderModal")

      expect(orderModal).toHaveLength(1)
    })
  })
})
