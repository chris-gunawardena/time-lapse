'use strict';

var mongoose = require('mongoose'),
	Project = mongoose.model('Project');


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



