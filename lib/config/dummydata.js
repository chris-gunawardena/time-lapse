'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Project = mongoose.model('Project');


//Project.find({}).remove(function() {
//	console.log( 'DELETED PROJECTS' );
//});

// Clear old users, then add a default user

/*
User.find({}).remove(function() {
	
	User.create({
		provider: 'local',
		name: 'Test User',
		email: 'test@test.com',
		password: 'test'
	},function( test_user ) {
		console.log( 'finished populating users: ' );


	});
});
*/