/**
 * Main application file
 */

import express from 'express';
import sqldb from './sqldb';
import config from './config/environment';
import http from 'http';
import slack from './components/slack/index.js';

// Populate databases with sample data
//if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    var env = app.get('env');
    if ('production' === env) {
      // OAuth Authentication Middleware
      slack("Server Restarted")
    }
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}
startServer()
// Expose app
exports = module.exports = app;
