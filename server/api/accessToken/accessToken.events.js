/**
 * AccessToken model events
 */

'use strict';

import {EventEmitter} from 'events';
var AccessToken = require('../../sqldb').AccessToken;
var AccessTokenEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AccessTokenEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  AccessToken.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    AccessTokenEvents.emit(event + ':' + doc._id, doc);
    AccessTokenEvents.emit(event, doc);
    done(null);
  }
}

export default AccessTokenEvents;
