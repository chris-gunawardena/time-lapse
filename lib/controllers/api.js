'use strict';
var Spooky = require('spooky');
var request = require('request');
var mongoose = require('mongoose'),
	Project = mongoose.model('Project');
var querystring = require('querystring');




exports.take_screenshot = function(req, res) {

	Project.findById(req.params.project_id, function (err, project) {
		if(err)
			return res.send( err );

		console.log("FOUND PROJECT");

		console.log(project);

		var jira_url = project.jira_url; //'https://aw2xcd.atlassian.net/secure/RapidBoard.jspa?rapidView=1';
		var jira_username = project.jira_username; //'aw2xcd';
		var jrira_password = project.jira_password; //'choppay170';


		console.log("startig spooky");

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

			spooky.start( jira_url );

			spooky.then(function() {
				// CASPERJS CONTEXT
				this.emit('console', 'fillSelectors start' );
				this.fillSelectors('form#form-crowd-login', {'input#username':    jira_username,	'input#password':    jrira_password }, true);
				this.emit('console', 'fillSelectors end' );

				//this.click('button#login');
			});

			spooky.then(function() {
				this.emit('post_screencapture', this.captureBase64('png') );
			});
			spooky.run();
		});


		spooky.on('console', function (line) {
			console.log(line);
		});

		spooky.on('error', function (e, stack) {
			console.error(e);

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
				project.screenshots.push( JSON.parse(body).data.link );
				return res.send( project );
			});

		});

	});


};


/**
 * Get awesome things

exports.take_screenshot = function(req, res) {
  return Thing.find(function (err, things) {
	if (!err) {
	  return res.json(things);
	} else {
	  return res.send(err);
	}
  });
};
 */