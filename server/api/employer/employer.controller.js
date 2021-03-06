/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/employers              ->  index
 * POST    /api/employers              ->  create
 * GET     /api/employers/:id          ->  show
 * PUT     /api/employers/:id          ->  update
 * DELETE  /api/employers/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Employer} from '../../sqldb';
import sequelize from 'sequelize';
import {handleUniqueValidationError} from '../../components/sequelize-errors';

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

function handleError(res, statusCode, err) {
  statusCode = statusCode || 500;
  res.status(statusCode).send(err);
}

// Gets a list of Employers
export function index(req, res) {
  Employer.findAll()
    .then(respondWithResult(res))
    .catch(err => handleError(res,500,err));
}

// Gets a single Employer from the DB
export function show(req, res) {
  Employer.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(err => handleError(res,500,err));
}

// Creates a new Employer in the DB
export function create(req, res) {
  if(req.body.name) {
    // Todo: DB Not handle Unique
    Employer.find({where:{name:req.body.name}})
      .then(employer => {
        if(!employer){
          return Employer.build(req.body)
            .set('is_customer', 0)
            .set('employer_type_id', 0)
            .set('verified', 0)
            .set('timestamp', Date.now())
            .set('system_defined', 1)
            .save()
            .then(employer =>  res.status(201).json(_.pick(employer, ['id', 'name'])))
            .catch(sequelize.ValidationError, handleUniqueValidationError(Employer,{name: req.body.name}))
            .catch(function (err) {
              return err.data ? res.status(409).json(_.pick(err.data, ['id', 'name'])) : handleError(res,400,err)
            });
        } else {
          return res.status(409).json(_.pick(employer, ['id', 'name']))
        }
      }).catch(err => {
        handleError(res, 400, err)
      })
  } else {
    handleError(res,400,{message:'param "name" missing in request body'})
  }
}

// Updates an existing Employer in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Employer.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(err => handleError(res,500,err));
}

// Deletes a Employer from the DB
export function destroy(req, res) {
  Employer.find({
    where: {
      id: req.params.cid
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(err => handleError(res,500,err));
}
