'use strict';

var app = require('../..');
import request from 'supertest';

var newEntityType;

describe('EntityType API:', function() {

  describe('GET /api/entityTypes', function() {
    var entityTypes;

    beforeEach(function(done) {
      request(app)
        .get('/api/entityTypes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          entityTypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      entityTypes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/entityTypes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/entityTypes')
        .send({
          name: 'New EntityType',
          info: 'This is the brand new entityType!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newEntityType = res.body;
          done();
        });
    });

    it('should respond with the newly created entityType', function() {
      newEntityType.name.should.equal('New EntityType');
      newEntityType.info.should.equal('This is the brand new entityType!!!');
    });

  });

  describe('GET /api/entityTypes/:id', function() {
    var entityType;

    beforeEach(function(done) {
      request(app)
        .get('/api/entityTypes/' + newEntityType._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          entityType = res.body;
          done();
        });
    });

    afterEach(function() {
      entityType = {};
    });

    it('should respond with the requested entityType', function() {
      entityType.name.should.equal('New EntityType');
      entityType.info.should.equal('This is the brand new entityType!!!');
    });

  });

  describe('PUT /api/entityTypes/:id', function() {
    var updatedEntityType;

    beforeEach(function(done) {
      request(app)
        .put('/api/entityTypes/' + newEntityType._id)
        .send({
          name: 'Updated EntityType',
          info: 'This is the updated entityType!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedEntityType = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEntityType = {};
    });

    it('should respond with the updated entityType', function() {
      updatedEntityType.name.should.equal('Updated EntityType');
      updatedEntityType.info.should.equal('This is the updated entityType!!!');
    });

  });

  describe('DELETE /api/entityTypes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/entityTypes/' + newEntityType._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when entityType does not exist', function(done) {
      request(app)
        .delete('/api/entityTypes/' + newEntityType._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
