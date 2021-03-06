/**
 * Express configuration
 */

'use strict';

import express from 'express';
//import favicon from 'serve-favicon';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import cors from 'cors';
import oAuthComponent from  './../components/oauthjs';
import config from './environment';
import sqldb from '../sqldb';
import 'express-zip';

export default function(app) {
  var env = app.get('env');

  app.use(cors());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  app.set('appPath', path.join(config.root, 'client'));

  // Plugged Applications
  app.use('/applications/partner/api', require('../applications/partner/api/login'));

  app.oauth = oAuthComponent;
  // OAuth Token authorization_code, password, refresh_token
  app.all('/oauth/token', app.oauth.grant());

  // Todo: Security Risk
  if ('production' === env) {
    // OAuth Authentication Middleware
    app.use(app.oauth.authorise());
  } else {
    // OAuth Proxy - Set your user id, group_id, client_id
    app.use(function(req, res, next){
      req.user = config.USER;
      return next();
    });
  }
  // OAuth Authorise from Third party applications
  app.use('/authorise', require('./../api/authorise'));  // /authorise
  // Todo: Temporary proxy - Removed in future
  app.use('/api/authorise', require('./../api/authorise'));
  app.use(app.oauth.errorHandler());

  if ('production' === env) {
    //app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    //app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
}
