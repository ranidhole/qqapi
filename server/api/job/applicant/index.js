

var express = require('express');
var controller = require('./applicant.controller');

var router = express.Router();

router.get('/:jobId/applicants', controller.index);
router.get('/:jobId/applicants/checkAlreadyApplied', controller.alreadyApplied);
router.get('/:jobId/applicants/:applicantId/checkAlreadyApplied', controller.alreadyAppliedWithApplicantId);
router.post('/:jobId/applicants', controller.create);
router.post('/:jobId/applicants/reapply', controller.reapply);
router.put('/:jobId/applicants/:applicantId', controller.update);
router.get('/:jobId/applicants/:applicantId', controller.show);


module.exports = router;
