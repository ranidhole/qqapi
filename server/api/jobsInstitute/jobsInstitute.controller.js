/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobsInstitutes              ->  index
 * POST    /api/jobsInstitutes              ->  create
 * GET     /api/jobsInstitutes/:id          ->  show
 * PUT     /api/jobsInstitutes/:id          ->  update
 * DELETE  /api/jobsInstitutes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {JobsInstitute} from '../../sqldb';

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

// Gets a list of JobsInstitutes
export function index(req, res) {
  JobsInstitute.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single JobsInstitute from the DB
export function show(req, res) {
  JobsInstitute.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new JobsInstitute in the DB
export function create(req, res) {
  JobsInstitute.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing JobsInstitute in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  JobsInstitute.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a JobsInstitute from the DB
export function destroy(req, res) {
  JobsInstitute.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
