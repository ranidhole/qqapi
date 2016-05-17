'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var entityTypeCtrlStub = {
  index: 'entityTypeCtrl.index',
  show: 'entityTypeCtrl.show',
  create: 'entityTypeCtrl.create',
  update: 'entityTypeCtrl.update',
  destroy: 'entityTypeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var entityTypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './entityType.controller': entityTypeCtrlStub
});

describe('EntityType API Router:', function() {

  it('should return an express router instance', function() {
    entityTypeIndex.should.equal(routerStub);
  });

  describe('GET /api/entityTypes', function() {

    it('should route to entityType.controller.index', function() {
      routerStub.get
        .withArgs('/', 'entityTypeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/entityTypes/:id', function() {

    it('should route to entityType.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'entityTypeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/entityTypes', function() {

    it('should route to entityType.controller.create', function() {
      routerStub.post
        .withArgs('/', 'entityTypeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/entityTypes/:id', function() {

    it('should route to entityType.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'entityTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/entityTypes/:id', function() {

    it('should route to entityType.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'entityTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/entityTypes/:id', function() {

    it('should route to entityType.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'entityTypeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
