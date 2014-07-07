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

//curl -D- -u jira_username:password -X GET http://your.jira.instrance.com/rest/api/2/search?jql=project=req.uest.info AND status=Resolved OR status=Closed

/**
 * Validations

ThingSchema.path('awesomeness').validate(function (num) {
  return num >= 1 && num <= 10;
}, 'Awesomeness must be between 1 and 10');
 */

mongoose.model('Project', ProjectSchema);
