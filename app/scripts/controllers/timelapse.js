'use strict';
/*jshint camelcase:false */

angular.module('jiraTimeLapseApp')
.controller('TimelapseCtrl', function ($scope, $http, $routeParams) {

	var work_week = [0,1,2,3,4,5,6];//0=sunday

	$scope.slides = [];
	$scope.slides_array = {};
	$scope.slides_array[ 'View all' ] = [];

	$http.get( '/api/projects/'+$routeParams.project_id ).success( function(project) {

		$scope.project = project;
		//$scope.interval = project.interval || 2500;
		$scope.interval = 500;

		for( var i=0; i<project.screenshots.length; i++ )
		{	var screenshoot_date = new Date( project.screenshots[i].text );
			var days_since_project_start = Math.ceil( (screenshoot_date.getTime() - new Date( project.project_start_date ).getTime() ) / (24*60*60*1000) );
			var sprint = Math.ceil( days_since_project_start/project.sprint_length );

			//only add to slder if its in in a work day, between work hours
			if(	project.work_week[ screenshoot_date.getDay() ]   &&   project.start_time<=screenshoot_date.getHours() && screenshoot_date.getHours()<=project.end_time ) 
			{	$scope.slides_array[ 'Sprint '+('0'+sprint).slice(-2) ] = $scope.slides_array[ 'Sprint '+('0'+sprint).slice(-2) ] || [];//Create array if none exits
				$scope.slides_array[ 'Sprint '+('0'+sprint).slice(-2) ].push( project.screenshots[i] );//add to proper spint
				$scope.slides_array[ 'View all' ].push( project.screenshots[i] );//add to all as well
			}
		}
		//dsp the last sprint
		$scope.slides = $scope.slides_array[ Object.keys($scope.slides_array).pop() ];
	});

}).filter('format_datetime', function() {
	return function(input_date) {
		var days_of_week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		var months_of_year = [ 'Jan', 'Feb', 'Mar', 'Apr', 'may', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		input_date = new Date(input_date);
		return days_of_week[input_date.getDay()]+', '+input_date.getDate()+' '+months_of_year[input_date.getMonth()]+' '+input_date.getFullYear()+' '+input_date.getHours()%12+':'+input_date.getMinutes()+''+(input_date.getHours()<12?'am':'pm');
	};
});