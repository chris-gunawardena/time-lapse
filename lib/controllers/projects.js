'use strict';

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Spooky = require('spooky');
var request = require('request');
var querystring = require('querystring');
//var moment = require('moment');


// GET /api/projects
exports.list = function(req, res) {
	//if logged in
	if( req.user  && req.user.userInfo && req.user.userInfo.id )
	{	Project.find( { 'user_id':  req.user.userInfo.id }, function (err, projects) {
			return res.json( projects );
		});
	}
	else
		return res.json("need to be logged in to list projects");
};

// GET /api/project/:id
exports.detail = function(req, res) {
	//if logged in & has project id
	if( req.user  && req.user.userInfo && req.user.userInfo.id )
	{	Project.findById( req.params.id, function (err, project) {
			return res.json( project );
		});
	}
	else
		return res.json("need to be logged in to list projects");
};

// POST /api/projects
exports.create = function(req, res) {
	//if logged in
	if( req.user  && req.user.userInfo && req.user.userInfo.id )
	{	var project = new Project( req.body );
		project.user_id =  req.user.userInfo.id;
		project.save();
		return res.json( project._id + " CREATED" );
	}else
		return res.json("need to be logged in to create project");	
};

// POST /api/projects/:id
exports.update = function(req, res) {
	Project.findByIdAndUpdate( req.params.id, { 'jira_url': req.body.jira_url, 'jira_username': req.body.jira_username, 'jira_password': req.body.jira_password }, function (err, project) {
		console.log(err);
		return res.json( req.params.id + ' UPDATED' );
	});
};

// DELETE /api/projects/:id
exports.delete = function(req, res) {
	Project.findByIdAndRemove( req.params.id, function(){
		return res.json( req.params.id + ' DELETED' );
	});
};

exports.take_screenshots = function(req, res) {
	Project.find({}, function (err, projects) {
		var number_of_projects_left_to_screenshot = projects.length;
		if( number_of_projects_left_to_screenshot==0 )
			return res.send( "done" );
		
		projects.forEach( function( project ) {
			var spooky = new Spooky({
				casper: {
					viewportSize: { width:1200, height:1200 },
					logLevel: 'debug',
					verbose: true,
					userAgent: 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'
				}
			}, function (err) {
				if (err)
					return res.send( err );

				spooky.start( project.jira_url );
				if( project.jira_username != '' )
				{	spooky.then( [ { jira_username: project.jira_username, jira_password: project.jira_password }, function() {
						this.fillSelectors('form#form-crowd-login', {'input#username':    jira_username,	'input#password':    jira_password }, true);
					}]);
				}

				spooky.then(function() {
					this.emit('post_screencapture', this.captureBase64('png') );
				});
				spooky.run();
			});

			spooky.on('console', function (line) { console.log(line);	});
			spooky.on('error', function (e, stack) { if (stack) { console.log(stack); } });

			spooky.on('post_screencapture', function (image_base64) {
				var album = '5SJMlv4n7QBaDlT';
				var client_id = 'e827c62d8cd2702';

				request.post({
					headers:	{ 'content-type' : 'application/x-www-form-urlencoded' , 'Authorization': 'Client-ID '+client_id },
					url:		'https://api.imgur.com/3/upload',
					body:		querystring.stringify( { image: image_base64, album: album } )
				}, function( error, response, body ){
					console.log( JSON.parse(body).data.link );
					project.screenshots.push( { image: JSON.parse(body).data.link, text: new Date().toISOString() } );
					project.save();
					number_of_projects_left_to_screenshot--;
					if( number_of_projects_left_to_screenshot==0 )
						return res.send( "done" );
					else
						console.log( number_of_projects_left_to_screenshot + ' to go' );
				});
			});			
		});
		//return res.send( projects );
	});
};

//
exports.take_screenshot = function(req, res) {
	Project.findById(req.params.project_id, function (err, project) {
		if(err)
			return res.send( err );

		var spooky = new Spooky({
			casper: {
				viewportSize: { width:1600, height:768 },
				logLevel: 'debug',
				verbose: true,
				userAgent: 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'
			}
		}, function (err) {
			if (err) {
				return res.send( err );
			}

			spooky.start( project.jira_url );
			spooky.then( [ { jira_username: project.jira_username, jira_password: project.jira_password }, function() {
				this.fillSelectors('form#form-crowd-login', {'input#username':    jira_username,	'input#password':    jira_password }, true);
			}]);
			spooky.then(function() {
				this.emit('post_screencapture', this.captureBase64('png') );
			});
			spooky.run();
		});

		spooky.on('console', function (line) {
			console.log(line);
		});

		spooky.on('error', function (e, stack) {
			if (stack) {
				console.log(stack);
			}
		});

		spooky.on('post_screencapture', function (image_base64) {
			var album = '5SJMlv4n7QBaDlT';
			var client_id = 'e827c62d8cd2702';

			request.post({
				headers:	{ 'content-type' : 'application/x-www-form-urlencoded' , 'Authorization': 'Client-ID '+client_id },
				url:		'https://api.imgur.com/3/upload',
				body:		querystring.stringify( { image: image_base64, album: album } )
			}, function( error, response, body ){
				console.log( JSON.parse(body).data.link );
				project.screenshots.push( { image: JSON.parse(body).data.link, text: new Date().toISOString() } );
				project.save();
				return res.send( project );
			});
		});
	});
};
