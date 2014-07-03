'use strict';
var Spooky = require('spooky');
var request = require('request');
var mongoose = require('mongoose'),
	Thing = mongoose.model('Thing');
var querystring = require('querystring');


exports.take_screenshot = function(req, res) {

	var spooky = new Spooky({
		casper: {
			viewportSize: { width:1600, height:768 },
			logLevel: 'debug',
			verbose: true,
			userAgent: 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'
		}
	}, function (err) {
		if (err) {
			var e = new Error('Failed to initialize SpookyJS');
			e.details = err;
			throw e;
		}
		// NODE CONTEXT
		console.log('no error');
		spooky.start('https://aw2xcd.atlassian.net/secure/RapidBoard.jspa?rapidView=1');


		spooky.then(function() {
			// CASPERJS CONTEXT
			this.fillSelectors('form#form-crowd-login', {'input#username':    'aw2xcd',	'input#password':    'choppay170' }, true);
			this.click('button#login');
		});

		spooky.then(function() {
			// CASPERJS CONTEXT
			//this.capture('screenshot.png', undefined, { format: 'png',	quality: 75 });
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
		console.log('START post_screencapture func');

		var album = '5SJMlv4n7QBaDlT';
		var client_id = 'e827c62d8cd2702';

		request.post({
			headers:	{ 'content-type' : 'application/x-www-form-urlencoded' , 'Authorization': 'Client-ID '+client_id },
			url:		'https://api.imgur.com/3/upload',
			body:		querystring.stringify( { image: image_base64, album: album } )
		}, function( error, response, body ){
			console.log( JSON.parse(body).data.link );
			return res.send("<a href='" + JSON.parse(body).data.link + "' target='_blank'>open</a>");
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