'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    

var ProjectSchema = new Schema({
  user_id: String,
  project_name: String,
  jira_url: String,
  jira_username: String,
  jira_password: String,

  project_start_date: String,
  sprint_length: Number,
  work_week: [Boolean],
  start_time: Number,
  end_time: Number,
  interval: Number,

  screenshots: []
});



//curl -D- -u jira_username:password -X GET http://your.jira.instrance.com/rest/api/2/search?jql=project=req.uest.info AND status=Resolved OR status=Closed


mongoose.model('Project', ProjectSchema);
