

var express = require('express');
var controller = require('./search.controller');
import authenticate from '../../components/oauth2/authenticate';

var router = express.Router();

router.get('/', controller.index);
router.get('/apply', authenticate({ scope: 'apply' }), controller.index);
router.post('/', controller.index);

module.exports = router;
