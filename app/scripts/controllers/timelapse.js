'use strict';

angular.module('jiraTimeLapseApp')
.controller('TimelapseCtrl', function ($scope, $http, $routeParams) {

	$scope.interval = 5000;
	$scope.slides = [];

	$http.get( '/api/projects/'+$routeParams.project_id ).success( function(project) {
		$scope.project = project;
		$scope.slides = project.screenshots;
	});			

});
