angular.module 'guclinkCommon'
  .directive 'gucEmail', (GUC_EMAIL_REGEX) ->
    directive =
      require: 'ngModel'
      restrict: 'A'
      link: (scope, element, attrs, ctrl) ->
        ctrl.$validators.guc_email = (modelValue, viewValue) ->
          if ctrl.$isEmpty modelValue
            return true
          return GUC_EMAIL_REGEX.test viewValue
