/**
 * EntityType model events
 */

'use strict';

import {EventEmitter} from 'events';
var EntityType = require('../../sqldb').EntityType;
var EntityTypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EntityTypeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  EntityType.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    EntityTypeEvents.emit(event + ':' + doc._id, doc);
    EntityTypeEvents.emit(event, doc);
    done(null);
  }
}

export default EntityTypeEvents;
