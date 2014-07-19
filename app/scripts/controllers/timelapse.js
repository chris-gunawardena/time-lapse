'use strict';
/*jshint camelcase:false */

angular.module('jiraTimeLapseApp')
.controller('TimelapseCtrl', function ($scope, $http, $routeParams) {

	var project_start_date = new Date('2014-05-26');
	var sprint_length = 14;//days
	var work_week = [1,2,3,4,5];//0=sunday
	var start_time = 8;//hours
	var end_time = 18;//hours

	$scope.interval = 2500;
	$scope.slides = [];
	$scope.slides_array = {};
	$scope.slides_array[ 'View all' ] = [];

	$http.get( '/api/projects/'+$routeParams.project_id ).success( function(project) {
		$scope.project = project;
		for( var i=0; i<project.screenshots.length; i++ )
		{	var screenshoot_date = new Date( project.screenshots[i].text );
			var days_since_project_start = Math.ceil( (screenshoot_date.getTime() - project_start_date.getTime() ) / (24*60*60*1000) );
			var sprint = Math.ceil( days_since_project_start/sprint_length );

			if(	work_week.indexOf(screenshoot_date.getDay()) != -1   &&   start_time<=screenshoot_date.getHours() && screenshoot_date.getHours()<=end_time ) //in the work week 
			{	$scope.slides_array[ 'Sprint '+sprint ] = $scope.slides_array[ 'Sprint '+sprint ] || [];//Create array if none exits
				$scope.slides_array[ 'Sprint '+sprint ].push( project.screenshots[i] );//add to proper spint
				$scope.slides_array[ 'View all' ].push( project.screenshots[i] );//add to all as well
			}
		}
		$scope.slides = $scope.slides_array['View all'];
		console.log( $scope.slides_array );
	});

}).filter('format_datetime', function() {
	return function(input_date) {
		var days_of_week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		var months_of_year = [ 'Jan', 'Feb', 'Mar', 'Apr', 'may', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		input_date = new Date(input_date);
		return days_of_week[input_date.getDay()]+', '+input_date.getDate()+' '+months_of_year[input_date.getMonth()]+' '+input_date.getFullYear()+' '+input_date.getHours()%12+':'+input_date.getMinutes()+''+(input_date.getHours()<12?'am':'pm');
	};
});