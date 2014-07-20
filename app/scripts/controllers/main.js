'use strict';
/*jshint camelcase:false */


angular.module('jiraTimeLapseApp')
.controller('MainCtrl', function ($scope, $http) {


	var load_projects = function(){
		//Load current projects
		$http.get('/api/projects').success( function(projects) {
			$scope.projects = projects;
		});
	};
	load_projects();

	//Init
	$scope.current_project = false;

	$scope.save_project = function(){
		if( $scope.current_project._id )
		{	$http.post('/api/projects/'+$scope.current_project._id, $scope.current_project).success( function() {
				load_projects();
				$scope.current_project = false;
			});
		}else{
			$http.post('/api/projects', $scope.current_project).success( function() {
				load_projects();
				$scope.current_project = false;
			});
		}
	};

	$scope.add_project = function(){
		$scope.current_project = {
			project_name: '',
			jira_url: '',
			jira_username: '',
			jira_password: '',
			project_start_date: '2014-07-01',
			sprint_length: 14,
			work_week: [false,true,true,true,true,true,false],
			start_time: 8,
			end_time: 18,
			interval: 2500
		};
	};
	$scope.open_project = function(project){
		$scope.current_project = project;
	};
	$scope.close_project = function(){
		$scope.current_project = false;
	};
	$scope.delete_project = function(project){
		if( confirm('Are you sure if you want to delete this project?') )
		{	$http.delete('/api/projects/'+project._id, $scope.current_project).success( function() {
				$scope.current_project = false;
				load_projects();
			});
		}
		$scope.current_project = false;
		//return false;
	};
}).filter('format_date', function() {
	return function(input_date) {
		var days_of_week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		var months_of_year = [ 'Jan', 'Feb', 'Mar', 'Apr', 'may', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		input_date = new Date(input_date);
		return days_of_week[input_date.getDay()]+', '+input_date.getDate()+' '+months_of_year[input_date.getMonth()]+' '+input_date.getFullYear();
	};
});
