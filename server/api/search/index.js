

var express = require('express');
var controller = require('./search.controller');
import authenticate2 from '../../components/oauth2/authenticate';
import authenticate from '../../components/oauthjs/authenticate';

var router = express.Router();

router.get('/', authenticate(), controller.index);
router.get('/apply', authenticate2({ scope: 'apply' }), controller.index);
router.post('/', authenticate(), controller.index);

module.exports = router;
