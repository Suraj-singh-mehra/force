_ = require 'underscore'
benv = require 'benv'
rewire = require 'rewire'
Backbone = require 'backbone'
existy = _.negate _.isUndefined
MerryGoRoundNavView = benv.requireWithJadeify require.resolve('../view'), ['template']
initCarousel = rewire '../index'
initCarousel.__set__ 'MerryGoRoundNavView', MerryGoRoundNavView

describe '#initCarousel', ->
  before (done) ->
    benv.setup ->
      benv.expose $: benv.require 'jquery'
      $.fn.imagesLoaded = (cb) -> cb()
      Backbone.$ = $

      flickity =
        on: (->)
        cells: [target: {}]
        selectedCell: target: {}
        getLastCell: -> target: {}

      stub = class MerryGoRoundFlickity
        constructor: -> @flickity = flickity

      initCarousel.__set__ 'MerryGoRoundFlickity', stub

      $('body').html "
        <div class='js-carousel'>
          <div class='js-mgr-cells'>
            <div class='js-mgr-cell'></div>
            <div class='js-mgr-cell'></div>
            <div class='js-mgr-cell'></div>
          </div>
          <nav class='js-mgr-navigation'></nav>
        </div>
      "
      done()

  after ->
    benv.teardown()

  it 'sets up the carousel', ->
    instance = initCarousel $('.js-carousel')
    existy(instance.cells).should.be.true()
    existy(instance.navigation).should.be.true()

  it 'pre-renders the navigation', ->
    instance = initCarousel $('.js-carousel')
    html = instance.navigation.$el.html()
    html.should.containEql 'mgr-arrow-left'
    html.should.containEql 'mgr-dots'
    html.should.containEql 'mgr-arrow-right'

  it 'accepts a callback', ->
    initCarousel $('.js-carousel'), null, (instance) ->
      existy(instance.cells).should.be.true()
      existy(instance.navigation).should.be.true()

  it 'returns without an error if there is no $el', ->
    initCarousel $('.sorry')
    _.isUndefined initCarousel()
      .should.be.true()

  describe 'option `imagesLoaded` is `true`', ->
    it 'returns a thennable', ->
      initCarousel $('.js-carousel'), imagesLoaded: true
        .then (instance) ->
          existy(instance.cells).should.be.true()
          existy(instance.navigation).should.be.true()
