'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Project = mongoose.model('Project');


// Clear old users, then add a default user
/*
User.find({}).remove(function() {
	
	User.create({
		provider: 'local',
		name: 'Test User',
		email: 'test@test.com',
		password: 'test'
	},function( test_user ) {
		console.log( 'finished populating users: '+test_user.userInfo.id );

		Project.create({
			user_id: test_user.userInfo.id,
			project_name: "test project",
			jira_url: "google.com",
			jira_username: "chris",
			jira_password: "xz"
		});


	});
});


*/