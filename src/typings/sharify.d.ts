declare module "sharify" {
  function sharify(): void
  export = sharify

  namespace sharify {
    /**
     * Do **not** use this on the server-side to store/access data that’s related
     * to a single request. Instead use `Response.locals.sharify.data`, which is
     * data associated to individual requests.
     *
     * @see {ResponseLocals}
     */
    export const data: GlobalData

    /**
     * These properties are set by Force and configured through environment variables.
     */
    export interface GlobalData {
      readonly ADMIN_URL: string
      readonly APP_URL: string
      readonly ARTIST_COLLECTIONS_RAIL?: string // TODO: remove after CollectionsRail a/b test
      readonly ARTIST_COLLECTIONS_RAIL_IDS: string[]
      readonly CMS_URL: string
      readonly CDN_URL: string
      CURRENT_PATH: string
      CURRENT_USER: User
      readonly ENABLE_SERVER_SIDE_CACHE: string
      readonly ENABLE_SIGN_IN_WITH_APPLE: string // TODO: Remove once sign in with apple is rolled out.
      readonly FACEBOOK_APP_NAMESPACE: string
      readonly FACEBOOK_ID: string
      readonly FORCE_CLOUDFRONT_URL: string
      readonly GEMINI_CLOUDFRONT_URL: string
      readonly GENOME_URL: string
      readonly GOOGLE_ADWORDS_ID: string
      readonly IMAGE_LAZY_LOADING: boolean
      IS_MOBILE: boolean
      readonly DEPLOY_ENV: string
      readonly METAPHYSICS_ENDPOINT: string
      readonly NODE_ENV: string
      readonly NOTIFICATION_COUNT: string
      readonly PREDICTION_URL: string
      readonly RECAPTCHA_KEY: string
      readonly SENTRY_PUBLIC_DSN: string
      readonly STRIPE_PUBLISHABLE_KEY: string
      readonly VOLLEY_ENDPOINT: string
      readonly XAPP_TOKEN: string

      // FORCE Tokens
      AP: {
        applePath?: string
        facebookPath?: string
        twitterPath?: string
        signupPagePath?: string
        loginPagePath?: string
      }
      API_URL: string
      APPLICATION_NAME: string
      ARTIST_PAGE_CTA_ARTIST_ID: string
      ARTIST_PAGE_CTA_ENABLED: string
      ARTSY_EDITORIAL_CHANNEL: string
      ARTSY_XAPP_TOKEN: string
      CSRF_TOKEN: string
      GALLERY_INSIGHTS_CHANNEL: string
      INTERCOM_BUYER_APP_ID: string
      INTERCOM_BUYER_ENABLED: boolean
      INTERCOM_BUYER_HASH: string
      JSON_PAGE_DATA: any
      MARKETING_SIGNUP_MODALS: any
      MARKETING_SIGNUP_MODALS: any[]
      PC_ARTSY_CHANNEL: string
      PC_AUCTION_CHANNEL: string
      POSITRON_URL: string
      SUBMISSION: string
      SUBMISSION_ID: string
      SUBMISSION_ARTIST_NAME: string
      TARGET_CAMPAIGN_URL: string

      // FIXME: reaction migration
      stitch: any
    }

    export interface ResponseLocalData extends GlobalData {
      RELAY_DATA?: any
      SUBMIT_URL?: string
      APP_TOKEN?: string
      SESSION_ID?: string
    }

    export interface ResponseLocal {
      /**
       * Request specific data. Use this to store data that’s to be used by other
       * parts of the stack during the processing of the remainder of the request
       * and to store data that’s to be made available to the client.
       */
      data: ResponseLocalData
      script: () => string
    }
  }
}
