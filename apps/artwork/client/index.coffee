{ extend, map } = require 'underscore'
{ CLIENT } = require('sharify').data
{ setCookie } = require '../../../components/recently_viewed_artworks/index.coffee'
metaphysics = require '../../../lib/metaphysics.coffee'
exec = require '../lib/exec.coffee'
templates =
  fold: -> require('./fold.jade') arguments...
  footer: -> require('./footer.jade') arguments...

helpers = extend [
  {}
  artist_artworks: require '../components/artist_artworks/helpers.coffee'
  auction_artworks: require '../components/auction_artworks/helpers.coffee'
  partner: require '../components/partner/helpers.coffee'
  related_artworks: require '../components/related_artworks/helpers.coffee'
  show_artworks: require '../components/show_artworks/helpers.coffee'
  partner_artworks: require '../components/partner_artworks/helpers.coffee'
]...

module.exports.init = ->
  setCookie(CLIENT._id)
  exec [
    require '../components/actions/index.coffee'
    require '../components/additional_info/index.coffee'
    require '../components/auction/index.coffee'
    require '../components/artists/index.coffee'
    require '../components/banner/index.coffee'
    require '../components/commercial/index.coffee'
    require '../components/images/index.coffee'
    require '../components/metadata/index.coffee'
  ]

  context = CLIENT.context or {}
  { query, init, variables } =
    if context.__typename is 'ArtworkContextAuction'
      query: """
          query artwork($id: String!, $isClosed: Bool!) {
            artwork(id: $id) {
              ... partner
              ... auction_artworks @exclude(if: $isClosed)
              ... artist_artworks @include(if: $isClosed)
              ... related_artworks @include(if: $isClosed)
            }
          }
          #{require '../../../components/artwork_brick/query.coffee'}
          #{require '../components/partner/query.coffee'}
          #{require '../components/auction_artworks/query.coffee'}
          #{require '../components/artist_artworks/query.coffee'}
          #{require '../components/related_artworks/query.coffee'}
        """
      variables:
        isClosed: context.is_closed

      init: _.compact [
          require '../components/partner/index.coffee'
          require '../components/auction_artworks/index.coffee' if !context.is_closed
          require '../components/artist_artworks/index.coffee' if context.is_closed
          require '../components/related_artworks/index.coffee' if context.is_closed
        ]

    # else if context.__typename 'ArtworkContextSale' # Unimplemented (loads default fold content)
    #

    else if context.__typename is 'ArtworkContextFair'
      query: """
          query artwork($id: String!) {
            artwork(id: $id) {
              ... fair_artworks
              ... partner
              ... artist_artworks
              ... related_artworks
            }
          }
          #{require '../../../components/artwork_brick/query.coffee'}
          #{require '../components/fair_artworks/query.coffee'}
          #{require '../components/partner/query.coffee'}
          #{require '../components/artist_artworks/query.coffee'}
          #{require '../components/related_artworks/query.coffee'}
        """
      init: [
          require '../components/fair_artworks/index.coffee'
          require '../components/partner/index.coffee'
          require '../components/artist_artworks/index.coffee'
          require '../components/related_artworks/index.coffee'
        ]

    else if context.__typename is 'ArtworkContextPartnerShow'
      query: """
          query artwork($id: String!) {
            artwork(id: $id) {
              ... partner
              ... show_artworks
              ... artist_artworks
              ... partner_artworks
              ... related_artworks
            }
          }
          #{require '../../../components/artwork_brick/query.coffee'}
          #{require '../components/partner/query.coffee'}
          #{require '../components/show_artworks/query.coffee'}
          #{require '../components/artist_artworks/query.coffee'}
          #{require '../components/partner_artworks/query.coffee'}
          #{require '../components/related_artworks/query.coffee'}
        """

      init: [
          require '../components/partner/index.coffee'
          require '../components/show_artworks/index.coffee'
          require '../components/artist_artworks/index.coffee'
          require '../components/partner_artworks/index.coffee'
          require '../components/related_artworks/index.coffee'
        ]

    else
      query: """
          query artwork($id: String!) {
            artwork(id: $id) {
              ... partner
              ... artist_artworks
              ... partner_artworks
              ... related_artworks
            }
          }
          #{require '../../../components/artwork_brick/query.coffee'}
          #{require '../components/partner/query.coffee'}
          #{require '../components/artist_artworks/query.coffee'}
          #{require '../components/partner_artworks/query.coffee'}
          #{require '../components/related_artworks/query.coffee'}
        """
      init: [
          require '../components/partner/index.coffee'
          require '../components/artist_artworks/index.coffee'
          require '../components/partner_artworks/index.coffee'
          require '../components/related_artworks/index.coffee'
        ]

  return unless query? and init?
  variables ?= {}
  metaphysics query: query, variables: _.extend id: CLIENT.id, variables
    .then (data) ->
      for key, template of templates
        $(".js-artwork-#{key}")
          .html template extend data,
            helpers: helpers

      exec init

