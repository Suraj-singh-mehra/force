import { renderHook } from "@testing-library/react-hooks"
import { fetchQuery } from "react-relay"
import {
  useScrollToOpenArtistAuthModal,
  USE_SCROLL_TO_OPEN_ARTIST_AUTH_MODAL_QUERY,
} from "../useScrollToOpenArtistAuthModal"

jest.mock("v2/Utils/getENV", () => {
  return {
    getENV: (key: string) => {
      switch (key) {
        case "ARTIST_PAGE_CTA_ENABLED":
          return true
        case "IS_MOBILE":
          return false
        case "CURRENT_USER":
          return null
        case "ARTIST_PAGE_CTA_ARTIST_ID":
          return "example"
        default:
          return null
      }
    },
  }
})

jest.mock("react-relay")

jest.mock("v2/System/useSystemContext", () => ({
  useSystemContext: jest.fn().mockReturnValue({ relayEnvironment: {} }),
}))

describe("CTA", () => {
  it("should query for artist data when artist cta is enabled and there is an artist id", () => {
    renderHook(() => useScrollToOpenArtistAuthModal())

    expect(fetchQuery).toBeCalledWith(
      expect.anything(),
      USE_SCROLL_TO_OPEN_ARTIST_AUTH_MODAL_QUERY,
      { id: "example" }
    )
  })
})
