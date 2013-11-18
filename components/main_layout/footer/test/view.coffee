rewire    = require 'rewire'
benv      = require 'benv'
Backbone  = require 'backbone'
sinon     = require 'sinon'

FooterView  = rewire '../view'
FooterView.__set__ 'FeedbackView', Backbone.View

describe 'FooterView', ->
  beforeEach (done) ->
    benv.setup =>
      benv.expose { $: require 'components-jquery' }
      Backbone.$ = $
      benv.render '../template.jade', {}, =>
        @view = new FooterView el: $('#main-layout-footer')
        done()

  it 'knows what year it is', ->
    now = (new Date).getFullYear()
    @view.$el.html().should.include now

  describe '#feedback', ->
    it 'Initializes a new FeedbackView and opens it', ->
      openSpy = sinon.spy Backbone.View::, 'initialize'
      @view.$('.mlf-feedback').click()
      openSpy.called.should.be.ok
