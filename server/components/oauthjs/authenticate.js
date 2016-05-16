/**
 * Created by Manjesh on 15-05-2016.
 */

import oauth from './index';
import config from '../../config/environment';

module.exports = function () {
  return function (req, res, next) {
    if (config.AUTH === 'false') {
      // OAuth Proxy - Set your user id, group_id, client_id in /server/config/local.env
      const request = req;
      request.user = config.USER;
      return next();
    } else {
      // OAuth Authentication Middleware
      return oauth.authorise()(req, res, next);
    }
  };
};
