

var express = require('express');
var controller = require('./applicant.controller');
import authenticate2 from '../../../components/oauth2/authenticate';
import authenticate from '../../../components/oauthjs/authenticate';

var router = express.Router();

router.get('/:jobId/applicants', authenticate(), controller.index);
router.get('/:jobId/applicants/checkAlreadyApplied', authenticate(), controller.alreadyApplied);
router.get('/:jobId/applicants/:applicantId/checkAlreadyApplied', authenticate(), controller.alreadyAppliedWithApplicantId);
router.post('/:jobId/applicants', authenticate(), controller.create);
router.post('/:jobId/applicants/apply', authenticate2({ scope: 'apply' }), controller.apply);
router.post('/:jobId/applicants/reapply', authenticate(), controller.reapply);
router.put('/:jobId/applicants/:applicantId', authenticate(), controller.update);
router.get('/:jobId/applicants/:applicantId', authenticate(), controller.show);

module.exports = router;
