'use strict';
var Spooky = require('spooky');
var mongoose = require('mongoose'),
	Thing = mongoose.model('Thing');



exports.take_screenshot = function(req, res) {

	var spooky = new Spooky({
		child: {
			transport: 'http'
		},
		casper: {
			logLevel: 'debug',
			verbose: true
		}
	}, function (err) {
		if (err) {
			var e = new Error('Failed to initialize SpookyJS');
			e.details = err;
			throw e;
		}
		// NODE CONTEXT
		console.log('no error');
		spooky.start('https://aw2xcd.atlassian.net/login');

		spooky.then(function() {
			// CASPERJS CONTEXT
		    this.fillSelectors('form#form-crowd-login', {
		        'input#username':    'aaa',
		        'input#password':    'bbb'
		    }, true);

			this.click('button#login');
		});

		spooky.then(function() {
			// CASPERJS CONTEXT
			//console.log('screenshot screenshot screenshot screenshot screenshot screenshot');
			//this.emit('screenshot screenshot screenshot screenshot screenshot screenshot');

			this.capture('screenshot.png', undefined, {
				format: 'png',
				quality: 75
			});
			/*var size = this.evaluate(function() {
				// PAGE CONTEXT
				console.log('....'); // DOES NOT GET PRINTED OUT
				//__utils__.echo('We are in the Page context'); // Gets printed out
				this.capture('screenshot', undefined, {
					format: 'png',
					quality: 75
				});
				return res.send("hellow");
			});*/
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

	//return res.send("hellow");
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