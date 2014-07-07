'use strict';

var mongoose = require('mongoose'),
	Project = mongoose.model('Project');


// GET /api/projects
// GET /api/projects/:id
exports.list = function(req, res) {
	//if( req.user && req.user && req.user.userInfo && req.user.userInfo.id )
	return res.json( req.user.userInfo.id );

};

// POST /api/projects
exports.create = function(req, res) {
	//if logged in
	if( req.user && req.user && req.user.userInfo && req.user.userInfo.id )
	{	var project = new Project(req.body);
		project.user_id =  req.user.userInfo.id;
		//project.project_name = '';
		//project.jira_url = '';
		//project.jira_username = '';
		//project.jira_password = '';
		project.save();
		return res.json(project);
	}else
		return res.json("need to be logged in to create project");
	
};


// POST /api/projects/:id
exports.update = function(req, res) {
};


// DELETE /api/projects/:id
exports.delete = function(req, res) {
};

