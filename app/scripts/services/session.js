'use strict';

angular.module('jiraTimeLapseApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
