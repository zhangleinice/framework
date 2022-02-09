// const delegate = require("delegates");
const delegate = require("./delegates");

module.exports = {
  inspect() {},
  toJSON() {},
  throw() {},
  onerror() {},
};

const proto = module.exports;

// 当你调用ctx.set()时，实际调用的是ctx.response.set();
// 可以少写一个response
delegate(proto, "response")
  .method("set")
  .method("append")
  .access("message")
  .access("body");

//   通过ctx.accepts()这样来调用到ctx.request.accepts()
delegate(proto, "request")
  .method("acceptsLanguages")
  .method("accepts")
  .access("querystring")
  .access("socket");
