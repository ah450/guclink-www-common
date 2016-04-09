angular.module 'guclinkCommon'
  .factory 'parseModelErrors', ->
    (message) ->
      ("#{key.split('_')
      .join(' ').capitalize()} #{value}." for key, value of message)
      .join ' '
