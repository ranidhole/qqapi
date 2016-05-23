/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  update
 * DELETE  /api/users/:id          ->  destroy
 */

import _ from 'lodash';
import db, { User, Group, Client } from '../../sqldb';

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  return res.status(statusCode).send(err);
}

/**
 * Get my info
 */
export function me(req, res) {
  Promise.all([
    Group.findById(req.user.group_id, {
      attributes: ['id', 'name'],
    }),
    Client.findById(req.user.client_id, {
      attributes: ['id', 'name', 'perc_revenue_share', 'termination_flag', 'consultant_survey',
        'consultant_survey_time', 'eng_mgr_id'],
    }),
    User.findById(req.user.id, {
      attributes: ['id', 'name', 'email_id', 'is_active'],
    }),
  ])
    .then(promiseReturns => {
      const group = promiseReturns[0];
      const client = promiseReturns[1];
      const user = promiseReturns[2];

      const whatBlocked = [];
      let isBlocked = false;

      if (user.is_active === 0) {
        whatBlocked.push({ priority: 0, url: 'terms-and-conditions' });
        isBlocked = true;
      }

      if (client.consultant_survey === 0) {
        whatBlocked.push({ priority: 1, url: 'preferences' });
        isBlocked = true;
      }

      if (client.toJSON().termination_flag === 1) {
        whatBlocked.push({ priority: 2, url: 'terminated-message' });
        isBlocked = true;
      }
      return db.UserTawktoToken.find({
        attributes: ['id', 'access_token'],
        where: {
          user_id: client.eng_mgr_id,
        },
      }).then(tawkToken => {
        const userme = _.assign(req.user, {
          name: user.name,
          tawk_token: _.get(tawkToken, 'access_token'),
          email_id: user.email_id,
          user_type: group.name,
          company_name: client.name,
          percRevenueShare: client.dataValues.perc_revenue_share,
          terminationFlag: client.dataValues.termination_flag,
          consultantSurvey: client.dataValues.consultant_survey,
          consultantSurveyTime: client.dataValues.consultant_survey_time,
          isBlocked,
          whatBlocked,
        });

        res.json(userme);
      });
    })
    .catch(err => handleError(res, 500, err));
}

export function states(req, res) {
  db.State
    .findAll({
      attributes: ['id', 'name', 'parent_id', 'config'],
      include: [
        {
          model: db.State,
          as: 'Childs',
          attributes: [['id', 'state_id']],
          required: false,
        },
        {
          model: db.ActionableState,
          as: 'Actions',
          where: {
            group_id: req.user.group_id,
          },
          attributes: [['child_id', 'state_id']],
          required: false,
        },
      ],
      order: [['id', 'ASC'], [{ model: db.ActionableState, as: 'Actions' }, 'id', 'ASC']],
    })
    .then(oStates => {
      const result = [];
      oStates.forEach((stateModel) => {
        const state = stateModel.toJSON();
        if (state.Childs.length === 0) state.Childs.push({ state_id: state.id });
        state.config = JSON.parse(state.config); // Need to handle Parsing Error
        result[state.id] = _.pick(state, ['id', 'name', 'config', 'Childs', 'Actions']);
      });

      res.json(result);
    })
    .catch(err => handleError(res, 500, err));
}
