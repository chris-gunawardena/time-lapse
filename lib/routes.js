'use strict';

var api = require('./controllers/api'),
	index = require('./controllers'),
	users = require('./controllers/users'),
	session = require('./controllers/session'),
	projects = require('./controllers/projects'),
	middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/take_screenshot/:project_id')
	.get(api.take_screenshot);
  
  app.route('/api/projects')
	.get(projects.list)
	.post(projects.create);

  app.route('/api/projects/:id')
	.get(projects.detail )
	.post(projects.update)
	.delete(projects.delete);

  app.route('/api/users')
	.post(users.create)
	.put(users.changePassword);
  app.route('/api/users/me')
	.get(users.me);
  app.route('/api/users/:id')
	.get(users.show);

  app.route('/api/session')
	.post(session.login)
	.delete(session.logout);

  // All undefined api routes should return a 404
  app.route('/api/*')
	.get(function(req, res) {
	  res.send(404);
	});

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
	.get(index.partials);
  app.route('/*')
	.get( middleware.setUserCookie, index.index);
};