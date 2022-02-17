/**
 * nodejs 中的 Emitter实现
 */

function EventEmitter(opts) {
  EventEmitter.init.call(this, opts);
}

EventEmitter.init = function () {
  if (this._events === undefined) {
  }
};
