/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/search              ->  index
 * POST    /api/search              ->  create
 * GET     /api/search/:id          ->  show
 * PUT     /api/search/:id          ->  update
 * DELETE  /api/search/:id          ->  destroy
 */

import _ from 'lodash';
import db, { Degree, Region, Institute, Industry, Employer, Skill, Func, Designation,
  Province, Solr, Client, State, User, Job,
  BUCKETS, Sequelize } from '../../sqldb';

function handleError(res, argStatusCode, err) {
  const status = argStatusCode || 500;
  res.status(status).send(err);
}


function sequelizeSearch(model, fieldName) {
  const field = fieldName || 'name';
  return (req, res) => {
    const options = {
      where: {},
      attributes: ['id', [field, 'name']],
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
    };

    options.where[field] = { $like: `${req.query.q}%` };

    // some tables may not have system_defined field
    if (model.attributes.system_defined) options.where.system_defined = 1;

    model.findAll(options)
      .then(searchResults => res.json(searchResults))
      .catch(err => handleError(res, 500, err));
  };
}

function sequelizeSearchRegion(model, fieldName) {
  const field = fieldName || 'name';
  return (req, res) => {
    const options = {
      where: {},
      attributes: ['id', 'region', [Sequelize.col('Province.name'), 'province'],
        [Sequelize.fn('CONCAT_WS', ', ', Sequelize.col('region'),
          Sequelize.col('Province.name')), 'alias']],
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
      include: {
        model: Province,
        attributes: [],
      },
    };

    options.where[field] = { $like: `${req.query.q}%` };

    // some tables may not have system_defined field
    if (model.attributes.verified) options.where.verified = 2;

    model.findAll(options)
      .then(searchResults => res.json(searchResults))
      .catch(err => handleError(res, 500, err));
  };
}

function applicantSearch() {
  return (req, res) => {
    let solrQueryPart = '';
    switch (req.user.group_id) {
      case BUCKETS.GROUPS.CONSULTANTS:
        solrQueryPart = `owner_id:${req.user.id} AND `;
        break;
      case BUCKETS.GROUPS.INTERNAL_TEAM:
        // nothing
        break;
      default:
        break;
    }
    // @todo more refactor Repeated Code
    if (!req.query.q) return res.json([]);
    const offset = req.query.offset || 0;
    const limit = (req.query.limit > 20) ? 20 : req.query.limit || 10;
    const fl = req.query.fl || [
      'id', 'name', 'exp_designation', 'edu_degree', 'exp_salary',
      'exp_employer', 'total_exp', 'exp_location', 'state_id',
      'state_name', 'applicant_score', 'created_on', '_root_', 'email', 'mobile',
    ].join(',');

    const solrQuery = Solr.createQuery()
      // Todo: Solr Mobile Number field currently not allow partial search
      .q(`${solrQueryPart}type_s:applicant
      AND ( name:*${req.query.q}*  ${!isNaN(req.query.q) ? `OR mobile:${req.query.q}` : ''}
      OR email:*${req.query.q}*  )`)
      .fl(fl)
      .start(offset)
      .rows(limit);
    return Solr.get('select', solrQuery, (err, result) => {
      if (err) return handleError(res, 400, err);
      return res.json(result.response.docs);
    });
  };
}

function sequelizeConsultantSearch(model, whereOptions) {
  const field = 'name';
  return (req, res) => {
    const options = {
      attributes: ['id', [field, 'name']],
      where: whereOptions || {},
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
    };

    options.where[field] = { $like: `${req.query.q}%` };

    // some tables may not have system_defined field
    if (model.attributes.system_defined) options.where.system_defined = 1;

    model.findAll(options)
      .then(searchResults => res.json(searchResults))
      .catch(err => handleError(res, 500, err));
  };
}

function sequelizeClientSearch(model) {
  const field = 'name';
  return (req, res) => {
    const options = {
      attributes: ['id', 'name'],
      where: {},
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
    };

    options.where[field] = { $like: `${req.query.q}%` };

    // some tables may not have system_defined field
    if (model.attributes.system_defined) options.where.system_defined = 1;

    model.findAll(options)
      .then(searchResults => res.json(searchResults))
      .catch(err => handleError(res, 500, err));
  };
}

function sequelizeClientEMSearch() {
  const field = 'name';
  return (req, res) => Client.findAll({
    where: {
      group_id: 5,
    },
    attributes: ['id', 'eng_mgr_id'],
    raw: true,
  }).then(clients => {
    const engMgrIds = _.map(clients, 'eng_mgr_id');

    const options = {
      attributes: ['id', [field, 'name']],
      where: { id: engMgrIds },
      raw: true,
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
    };

    options.where[field] = { $like: `${req.query.q}%` };

    return User.findAll(options).then(users => res.json(users));
  }).catch(err => handleError(res, 500, err));
}

function sequelizeConsultantEMSearch() {
  const field = 'name';
  return (req, res) => Client.findAll({
    where: {
      group_id: 2,
    },
    attributes: ['id', 'eng_mgr_id'],
    raw: true,
  }).then(clients => {
    const engMgrIds = _.map(clients, 'eng_mgr_id');

    const options = {
      attributes: ['id', [field, 'name']],
      where: { id: engMgrIds },
      raw: true,
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
    };

    options.where[field] = { $like: `${req.query.q}%` };

    return User.findAll(options).then(users => res.json(users));
  }).catch(err => handleError(res, 500, err));
}

function sequelizeClientwiseJobSearch() {
  const field = 'role';
  return (req, res) => User.findAll({
    where: {
      client_id: req.query.ids,
    },
    attributes: ['id'],
    raw: true,
  }).then(users => {
    const userIds = _.map(users, 'id');

    const options = {
      attributes: ['id', [field, 'name']],
      where: { user_id: userIds },
      raw: true,
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
    };

    if (req.query.q) options.where[field] = { $like: `${req.query.q}%` };

    return Job.findAll(options).then(jobs => res.json(jobs));
  }).catch(err => handleError(res, 500, err));
}

function solrApplicantSearch() {
  return (req, res) => {
    const offset = req.query.offset || 0;
    const limit = (req.query.limit > 20) ? 20 : req.query.limit || 1;
    const fl = req.query.fl || [
      'eng_mgr_name', 'applicant_score', 'state_name',
        // 'id', 'owner_id','name', 'exp_designation', 'edu_degree', 'exp_salary','client_name',
        // 'exp_employer', 'total_exp', 'exp_location', 'state_id',
        // 'state_name', 'applicant_score', 'created_on'
    ].join(',');


    const solrQuery = Solr.createQuery()
      .q(`state_name:("${req.query.status.split(',').join('" "')}")
      AND client_name:("${req.query.consultants.split(',').join('" "')}")
        AND eng_mgr_name:("${req.query.consultantems.split(',').join('" "')}")
        AND exp_location:("${
        req.query.location.split(',').join('" "')}")
        AND applicant_score:{${req.query.cvscoreFrom} TO ${req.query.cvscoreTo}}
        AND  type_s:applicant`)
      .fl(fl)
      .start(offset)
      .rows(limit);


    Solr.get('select', solrQuery, (err, result) => {
      if (err) return handleError(res, 500, err);
      return res.json(result.response.docs);
    });
  };
}

function applicantStatusSolr() {
  return (req, res) => {
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 40;
    const fl = req.query.fl || [
      'id', 'name', 'mobile', 'updated_on', 'state_name', 'client_name', 'eng_mgr_name',
      'interview_time', '_root_', 'applicant_score', 'consultant_username', 'mobile',
      'latest_comment', 'exp_location', 'interview_time', 'updated_on', 'created_on',
    ].join(',');


    const solrQuery = Solr.createQuery()
      .q(req.body.q)
      .fl(fl)
      .start(offset)
      .rows(limit)
      .facet({ field: 'state_id' })
      .facet({ field: 'consultant_username_sf' })
      .facet({ field: 'client_name_sf' })
      .facet({ field: 'eng_mgr_name_sf' })
      .facet({ field: 'exp_location' });

    if (req.body.params) {
      if (req.body.params.fq !== '' && typeof req.body.params.fq !== 'undefined') {
        solrQuery.parameters.push(encodeURI(`fq=${req.body.params.fq}`));
        if (req.body.params.fq.state_id) {
          solrQuery.matchFilter('state_id', req.body.params.fq.state_id);
        }
      }
    }

    Solr.get('select', solrQuery, (err, result) => {
      if (err) return handleError(res, 500, err);
      const applicants = result.response.docs;
      if (!applicants.length) return res.status(204).json([]);
      const solrInnerQuery = Solr
        .createQuery()
        .q(`id:(${applicants.map(a => a._root_).join(' OR ')}) AND type_s:job`)
        .fl([
          'id', 'role', 'client_name', 'eng_mgr_name', 'recruiter_username', 'consultant_score',
          'screening_score', 'client_score', 'job_status',
        ])
        .rows(applicants.length)
        .facet({ field: 'client_name' })
        .facet({ field: 'eng_mgr_name_sf' })
        .facet({ field: 'role' });

// Get job to attach to results
      return Solr.get('select', solrInnerQuery, (jobErr, jobs) => {
        if (jobErr) return res.status(500).json(err);
        applicants.forEach((applicant, key) => {
          applicants[key]._root_ = jobs.response.docs
            .filter(s => s.id === applicants[key]._root_)[0];
        });
        const resultTemp = result;
        resultTemp.response.docs = applicants;
        resultTemp.job_facet_counts = jobs.facet_counts;
        return res.json(resultTemp);
      });
    });
  };
}

function currentConsultantAllocJobClients() {
  return (req, res) => {
    const options = {
      attributes: ['id'],
      where: {
        user_id: req.user.id, // consultant_id
        status: 1,
      },
      include: [{
        model: db.Job,
        attributes: ['user_id', 'role'],
        where: { status: 1 },
        include: [{
          attributes: [],
          model: db.JobStatus,
        }],
      }, {
        model: db.ConsultantResponse,
        attributes: [],
        where: {
          user_id: req.user.id, // consultant_id
          response_id: 1,
        },
      }],
    };

    db.JobAllocation.findAll(options).then(jobOwners => {
      const owners = jobOwners.map(jobOwner => jobOwner.Job.user_id);

      return db.Client.findAll({
        limit: Number(req.query.limit) || 10,
        offset: Number(req.query.offset) || 0,
        attributes: ['id', 'name'],
        where: {
          name: { $like: `${req.query.q}%` },
        },
        include: [{
          model: db.User,
          attributes: [],
          where: {
            id: owners,
          },
        }],
      }).then(clients => res.json(clients));
    }).catch(err => handleError(res, 500, err));
  };
}

function currentConsultantAllocJobsByClient(clientIds) {
  const field = 'role';
  return (req, res) => db.User.findAll({
    where: {
      client_id: clientIds,
    },
  }).then(clientUsers => {
    const clientUsersIds = clientUsers.map(user => user.id);
    return db.JobAllocation.findAll({
      attributes: ['id'],
      where: {
        user_id: req.user.id, // consultant_id
        status: 1,
      },
      include: [{
        model: db.Job,
        attributes: ['id', [field, 'name']],
        where: { status: 1, user_id: clientUsersIds },
        include: [{
          attributes: [],
          model: db.JobStatus,
        }],
      }, {
        model: db.ConsultantResponse,
        attributes: [],
        where: {
          user_id: req.user.id, // consultant_id
          response_id: 1,
        },
      }],
    }).then(jobAllocations => {
      const jobs = jobAllocations.map(jobAllocation => jobAllocation.Job);
      return res.json(jobs);
    }).catch(err => handleError(res, 500, err));
  });
}

function clientUsersJobManage(clientId) {
  const field = 'role';
  return (req, res) => db.User.findAll({
    where: {
      client_id: clientId,
    },
  }).then(clientUsers => {
    const clientUsersIds = clientUsers.map(user => user.id);
    return db.Job.findAll({
      limit: Number(req.query.limit) || 10,
      offset: Number(req.query.offset) || 0,
      attributes: ['id', [field, 'name']],
      where: { status: 1, user_id: clientUsersIds, role: { $like: `${req.query.q}%` } },
    }).then(jobs => {

      return res.json(jobs);
    }).catch(err => handleError(res, 500, err));
  });
}


// Gets a list of SearchsFunc
export function index(req, res) {
  if (req.query.type) {
    switch (req.query.type) {
      case 'applicants':
        applicantSearch()(req, res);
        break;
      case 'degrees':
        sequelizeSearch(Degree, 'degree')(req, res);
        break;
      case 'regions':
        sequelizeSearchRegion(Region, 'region')(req, res);
        break;
      case 'institutes':
        sequelizeSearch(Institute)(req, res);
        break;
      case 'industries':
        sequelizeSearch(Industry)(req, res);
        break;
      case 'employers':
        sequelizeSearch(Employer)(req, res);
        break;
      case 'skills':
        sequelizeSearch(Skill)(req, res);
        break;
      case 'funcs':
        sequelizeSearch(Func)(req, res);
        break;
      case 'designations':
        sequelizeSearch(Designation)(req, res);
        break;
      case 'states':
        sequelizeSearch(State)(req, res);
        break;
      case 'current_consultant_alloc_job_clients':
        currentConsultantAllocJobClients()(req, res);
        break;
      case 'clients':
        sequelizeClientSearch(Client)(req, res);
        break;
      case 'consultants': {
        const wheres = { group_id: 2 };
        sequelizeConsultantSearch(User, wheres)(req, res);
        break;
      }
      case 'client-eng-mgrs':
        sequelizeClientEMSearch()(req, res);
        break;
      case 'consultant-eng-mgrs':
        sequelizeConsultantEMSearch()(req, res);
        break;
      case 'jobs':
        sequelizeClientwiseJobSearch(Job)(req, res);
        break;
      case 'advanced':
        solrApplicantSearch()(req, res);
        break;
      case 'applicantStatusSolr':
        applicantStatusSolr()(req, res);
        break;
      case 'current_consultant_alloc_jobs_by_client':
        currentConsultantAllocJobsByClient(req.query.id)(req, res);
        break;
      case 'client_users_job_manage':
        clientUsersJobManage(req.query.id)(req, res);
        break;
      default:
        break;
    }
  }
}

