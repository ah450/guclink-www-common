describe 'parseModelErrors', ->
  beforeEach module 'guclinkCommon'
  parseModelErrors = null
  beforeEach inject (_parseModelErrors_) ->
    parseModelErrors = _parseModelErrors_

  it 'parses message', ->
    sample =
      name: 'is required'
      email: 'must be guc'

    result = parseModelErrors(sample)
    expect(result).to.eql("Name is required. Email must be guc.")
