'use strict';
var not_camel_case = 2;

angular.module('jiraTimeLapseApp')
.controller('TimelapseCtrl', function ($scope, $http, $routeParams) {

	var start_date = new Date('2014-07-08');
	var end_date = new Date('2014-07-10');
	var work_week = [1,2,3,4,5];
	var start_time = 8;//hours
	var end_time = 18;//hours

	$scope.interval = 250;
	$scope.slides = [];

	$http.get( '/api/projects/'+$routeParams.project_id ).success( function(project) {
		$scope.project = project;
		for( var i=0; i<project.screenshots.length; i++ )
		{	var screenshoot_date = new Date( project.screenshots[i].text );
			if	(	start_date.getTime()<=screenshoot_date.getTime() && end_date.getTime()<=screenshoot_date.getTime() && //within date range
					work_week.indexOf( screenshoot_date.getDay() ) && //in the work week
					start_time<=screenshoot_date.getHours() && end_time<=screenshoot_date.getHours() //within work hours
				)
			{
				$scope.slides.push( project.screenshots[i] );
			}

		}
		//$scope.slides = project.screenshots;
	});			

}).filter('format_datetime', function() {
	return function(input_date) {
		var days_of_week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		var months_of_year = [ 'Jan', 'Feb', 'Mar', 'Apr', 'may', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		var input_date = new Date(input_date);
		return days_of_week[input_date.getDay()]+', '+input_date.getDate()+' '+months_of_year[input_date.getMonth()]+' '+input_date.getFullYear()+' '+input_date.getHours()%12+':'+input_date.getMinutes()+''+(input_date.getHours()<12?'am':'pm');
	};
});