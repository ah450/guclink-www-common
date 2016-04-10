(function() {
  angular.module('guclinkCommon', []);

}).call(this);

(function() {
  angular.module('guclinkCommon').constant('GUC_ID_REGEX', /^([0-9]+)-([0-9]+)$/).constant('GUC_EMAIL_REGEX', /^[a-zA-Z\.\-]+@(student.)?guc.edu.eg$/).constant('STUDENT_EMAIL_REGEX', /^[a-zA-Z\.\-]+@student.guc.edu.eg$/).constant('defaultPageSize', 15);

}).call(this);


/*
Pagination helper service
 */

(function() {
  angular.module('guclinkCommon').factory('Pagination', function($q) {
    var Pagination;
    return Pagination = (function() {
      function Pagination(resource, pluralName, params, factory, pageSize) {
        this.resource = resource;
        this.pluralName = pluralName;
        this.params = params != null ? params : {};
        this.factory = factory != null ? factory : _.identity;
        this.pageSize = pageSize != null ? pageSize : 10;
        this.data = [];
        this.loaded = false;
        this.currentPage = 1;
        this.totalPages = 0;
      }

      Pagination.prototype.at = function(index, page) {
        if (page == null) {
          page = this.currentPage;
        }
        return $q((function(_this) {
          return function(resolve, reject) {
            if (!_this.loaded || _this.currentPage !== page) {
              return _this.load(page, resolve, reject, index);
            } else {
              return resolve(_this.data[index]);
            }
          };
        })(this));
      };

      Pagination.prototype.load = function(page, resolve, reject, index) {
        var failure, queryOpts, success;
        this.loaded = false;
        success = (function(_this) {
          return function(page) {
            var item;
            _this.data = (function() {
              var i, len, ref, results;
              ref = page[this.pluralName];
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                item = ref[i];
                results.push(this.factory(item));
              }
              return results;
            }).call(_this);
            _this.currentPage = page['page'];
            _this.totalPages = page['total_pages'];
            _this.loaded = true;
            if (index) {
              return resolve(_this.data[index]);
            } else {
              return resolve(_this.data);
            }
          };
        })(this);
        failure = _.bind(this.loadFailure, this, reject);
        queryOpts = {
          page: page,
          page_size: this.pageSize
        };
        _.extend(queryOpts, this.params);
        return this.resource.query(queryOpts, success, failure);
      };

      Pagination.prototype.loadFailure = function(reject, response) {
        console.error('failed to load page', this.currentPage, 'for', this.resource);
        return reject(response);
      };

      Pagination.prototype.page = function(pageNum) {
        return $q((function(_this) {
          return function(resolve, reject) {
            if (!_this.loaded || _this.currentPage !== pageNum) {
              return _this.load(pageNum, resolve, reject);
            } else {
              return resolve(_this.data);
            }
          };
        })(this));
      };

      Pagination.prototype.hasPages = function() {
        return this.currentPage < this.totalPages;
      };

      Pagination.prototype.reload = function() {
        return $q((function(_this) {
          return function(resolve, reject) {
            return _this.load(_this.currentPage, resolve, reject);
          };
        })(this));
      };

      return Pagination;

    })();
  });

}).call(this);

(function() {
  angular.module('guclinkCommon').factory('parseModelErrors', function() {
    return function(message) {
      var key, value;
      return ((function() {
        var results;
        results = [];
        for (key in message) {
          value = message[key];
          results.push((key.split('_').join(' ').capitalize()) + " " + value + ".");
        }
        return results;
      })()).join(' ');
    };
  });

}).call(this);

(function() {
  angular.module('guclinkCommon').directive('gucEmail', function(GUC_EMAIL_REGEX) {
    var directive;
    return directive = {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, ctrl) {
        return ctrl.$validators.guc_email = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }
          return GUC_EMAIL_REGEX.test(viewValue);
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module('guclinkCommon').directive('gucId', function(GUC_ID_REGEX) {
    var directive;
    return directive = {
      require: 'ngModel',
      restrict: 'A',
      link: function($scope, element, attrs, ctrl) {
        return ctrl.$validators.guc_id = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }
          return GUC_ID_REGEX.test(viewValue);
        };
      }
    };
  });

}).call(this);
