'use strict';

angular.module('jiraTimeLapseApp')
.controller('TimelapseCtrl', function ($scope, $http, $routeParams) {


	var load_project = function(){
		//Load current projects
		$http.get( '/api/projects/'+$routeParams.project_id ).success( function(project) {
			$scope.project = project;
		});			
	};
	load_project();

/*	$scope.myInterval = 5000;
	var slides = $scope.slides = [];
	$scope.addSlide = function() {
		var newWidth = 600 + slides.length;
		slides.push({
			image: 'http://placekitten.com/' + newWidth + '/300',
			text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
				['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
		});
	};
	for (var i=0; i<4; i++) {
	$scope.addSlide();
	}
*/

});
