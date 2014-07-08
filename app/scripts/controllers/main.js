'use strict';

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
		{	$http.post('/api/projects/'+$scope.current_project._id, $scope.current_project).success( function(saved_project) {
				$scope.current_project = false;
				load_projects();
			});
		}else{
			$http.post('/api/projects', $scope.current_project).success( function(saved_project) {
				$scope.current_project = false;
				load_projects();
			});					
		}
	};

	$scope.add_project = function(){
		$scope.current_project = {
			project_name: '',
			jira_url: 'https://aw2xcd.atlassian.net/secure/RapidBoard.jspa?rapidView=1', 
			jira_username: 'aw2xcd', 
			jira_password: 'choppay170' 
		};
	};
	$scope.open_project = function(project){
		$scope.current_project = project;
	};
	$scope.close_project = function(){
		$scope.current_project = false;
	};
	$scope.delete_project = function(project){
		if( confirm("Are you sure if you want to delete this project?") )
		{	$http.delete('/api/projects/'+project._id, $scope.current_project).success( function(saved_project) {
				$scope.current_project = false;
				load_projects();
			});
		}
		$scope.current_project = false;
		//return false;
	};
});
