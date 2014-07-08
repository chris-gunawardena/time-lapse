'use strict';
var Spooky = require('spooky');
var request = require('request');
var mongoose = require('mongoose'),
	Project = mongoose.model('Project');
var querystring = require('querystring');

var jira_url;
var jira_username;
var jrira_password;


