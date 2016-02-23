/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  update
 * DELETE  /api/users/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {User, Group, Client, State, ActionableState} from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Users
export function index(req, res) {
  User.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user.id;
  Promise.all([
      Group.findById(req.user.group_id, {
        attributes: ['id', 'name'],
      }),

      Client.findById(req.user.client_id, {
        attributes: ['id', 'name'],
      }),
    ])
    .then(function gotUser(user) {
      const userme = _.assign(req.user, {
        user_type: user[0].name,
        company_name: user[1].name,
      });

      res.json(userme);
    })
    .catch(err => next(err));
}

export function states(req, res, next) {
  return State
    .findAll({
      attributes: ['id', 'name', 'parent_id', 'config'],
      include: [
        {
          model: State,
          as: 'Childs',
          attributes: [['id', 'state_id']],
          required: false,
        },
        {
          model: ActionableState,
          as: 'Actions',
          where: {
            group_id: 5,
          },
          attributes: [['child_id', 'state_id']],
          required: false,
        },
      ],
      order: [['id', 'ASC'], [{ model: ActionableState, as: 'Actions' }, 'id', 'ASC']],
    })
    .then(function buildStateConfig(states) {
      const result = [];
      states.forEach(function formatStates(stateModel) {
        const state = stateModel.toJSON();
        if (state.Childs.length === 0) state.Childs.push({ state_id: state.id });
        state.config = JSON.parse(state.config); // Need to handle Parsing Error
        result[state.id] = _.pick(state, ['id', 'name', 'config', 'Childs', 'Actions']);
      });

      return res.json(result);
    })
    .catch(err => next(err));
}

// Gets a single User from the DB
export function show(req, res) {
  User.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new User in the DB
export function create(req, res) {
  User.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing User in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  User.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a User from the DB
export function destroy(req, res) {
  User.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
