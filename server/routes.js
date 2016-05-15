/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'canonical-path';

export default function(app) {

  // Insert routes below
  app.use('/api/entityTypes', require('./api/entityType'));
  app.use('/api/EntityTypes', require('./api/EntityType'));
  app.use('/api/clientPaymentDesignations', require('./api/clientPaymentDesignation'));
  app.use('/api/agreements', require('./api/agreement'));
  app.use('/api/clientPaymentMaps', require('./api/clientPaymentMap'));
  app.use('/api/userTawktoTokens', require('./api/userTawktoToken'));
  app.use('/api/screeningStates', require('./api/screeningState'));
  app.use('/api/applicantScreenings', require('./api/applicantScreening'));
  app.use('/api/applicantPreferenceTimes', require('./api/applicantPreferenceTime'));
  //app.use('/api/jobs', require('./api/job/reference'));
  app.use('/api/references', require('./api/reference'));
  app.use('/api/clientPayments', require('./api/clientPayment'));
  app.use('/api/logs', require('./api/log'));
  app.use('/api/responses', require('./api/response'));
  app.use('/api/consultantResponses', require('./api/consultantResponse'));
  app.use('/api/search', require('./api/search'));
  app.use('/api/applicants', require('./api/applicant/comment'));
  app.use('/api/welcomes', require('./api/welcome'));
  app.use('/api/applicantViews', require('./api/applicantView'));
  app.use('/api/usageLogs', require('./api/usageLog'));
  app.use('/api/resumes', require('./api/resume'));
  app.use('/api/queuedTasks', require('./api/queuedTask'));
  app.use('/api/referrals', require('./api/referral'));
  app.use('/api/phoneNumbers', require('./api/phoneNumber'));
  app.use('/api/notifications', require('./api/notification'));
  app.use('/api/jobViews', require('./api/jobView'));
  app.use('/api/jobStatusLogs', require('./api/jobStatusLog'));
  app.use('/api/jobStatus', require('./api/jobStatus'));
  app.use('/api/jobSkills', require('./api/jobSkill'));
  app.use('/api/jobsInstitutes', require('./api/jobsInstitute'));
  app.use('/api/jobsIndustries', require('./api/jobsIndustry'));
  app.use('/api/jobsEmployers', require('./api/jobsEmployer'));
  app.use('/api/jobsDegrees', require('./api/jobsDegree'));
  app.use('/api/jobScores', require('./api/jobScore'));
  app.use('/api/jobDownloads', require('./api/jobDownload'));
  app.use('/api/jobContents', require('./api/jobContent'));
  app.use('/api/jobApplications', require('./api/jobApplication'));
  app.use('/api/hotlines', require('./api/hotline'));
  app.use('/api/followerTypes', require('./api/followerType'));
  app.use('/api/followerAccess', require('./api/followerAccess'));
  app.use('/api/followers', require('./api/follower'));
  app.use('/api/experiences', require('./api/experience'));
  app.use('/api/emails', require('./api/email'));
  app.use('/api/educations', require('./api/education'));
  app.use('/api/clientPreferredIndustries', require('./api/clientPreferredIndustry'));
  app.use('/api/clientPreferredFunctions', require('./api/clientPreferredFunction'));
  app.use('/api/applicantSkills', require('./api/applicantSkill'));
  app.use('/api/applicantScoreLogs', require('./api/applicantScoreLog'));
  app.use('/api/regions', require('./api/region'));
  app.use('/api/paymentMethods', require('./api/paymentMethod'));
  app.use('/api/institutes', require('./api/institute'));
  app.use('/api/funcs', require('./api/func'));
  app.use('/api/designations', require('./api/designation'));
  app.use('/api/authCodes', require('./api/authCode'));
  app.use('/api/skills', require('./api/skill'));
  app.use('/api/refreshTokens', require('./api/refreshToken'));
  app.use('/api/logos', require('./api/logo'));
  app.use('/api/industries', require('./api/industry'));
  app.use('/api/endpoints', require('./api/endpoint'));
  app.use('/api/degrees', require('./api/degree'));
  app.use('/api/apps', require('./api/app'));
  app.use('/api/scopes', require('./api/scope'));
  app.use('/api/provinces', require('./api/province'));
  app.use('/api/itemScopes', require('./api/itemScope'));
  app.use('/api/groups', require('./api/group'));
  app.use('/api/employers', require('./api/employer'));
  app.use('/api/clients', require('./api/client'));
  app.use('/api/accessTokens', require('./api/accessToken'));
  app.use('/api/applicantDownloads', require('./api/applicantDownload'));
  app.use('/api/states', require('./api/state'));
  app.use('/api/summary', require('./api/summary'));
  app.use('/api/jobComments', require('./api/jobComment'));
  app.use('/api/applicantStates', require('./api/applicantState'));
  app.use('/api/jobs', require('./api/job/comment'));
  app.use('/api/jobs', require('./api/job/applicant'));
  app.use('/api/jobAllocations', require('./api/jobAllocation'));
  app.use('/api/jobs', require('./api/job'));
  app.use('/api/jobs', require('./api/job/applicant'));
  app.use('/api/applicants', require('./api/applicant'));
  app.use('/api/partners', require('./api/partner'));
  app.use('/api/users', require('./api/user'));
  app.use('/user', require('./api/user/proxy.js'));

  // All undefined asset or api routes should return a 404
  //app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  app.route('/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  //app.route('/*')
  //  .get((req, res) => {
  //    res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
  //  });
}
