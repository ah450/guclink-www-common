describe 'parseModelErrors', ->
  beforeEach module 'guclinkCommon'
  parseModelErrors = null
  beforeEach inject (_parseModelErrors_) ->
    parseModelErrors = _parseModelErrors_
