'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var ProjectSchema = new Schema({
	user_id: String,
	project_name: String,
	jira_url: String,
	jira_username: String,
	jira_password: String,
	screenshots: []
});


mongoose.model('Project', ProjectSchema);
