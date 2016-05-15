/**
 * Created by Manjesh on 15-05-2016.
 */

import oauth from './index';

module.exports = function () {
  return function (req, res, next) {
      return oauth.authorise()(req, res, next);
  };
}
/*
if (env !== 'production') {
  // OAuth Authentication Middleware
  app.use(app.oauth.authorise());
} else {
  // OAuth Proxy - Set your user id, group_id, client_id
  app.use(function (req, res, next) {
    const request = req
    request.user = config.USER;
    return next();
  });
}
*/
