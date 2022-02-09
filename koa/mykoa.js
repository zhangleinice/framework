/**
 * koa中间件实现原理
 */

const http = require("http");
const Emitter = require("events");
const context = require("./context");

module.exports = class Application extends Emitter {
  constructor() {
    super();
    this.middleware_list = [];
    this.context = {};
  }

  // 注册中间件
  use(middleware) {
    if (typeof middleware !== "function")
      throw new TypeError("middleware must be a function!");
    this.middleware_list.push(middleware);
    return this;
  }

  // 传给http.createServer的回调函数
  callback() {
    // compose 将中间件合并成一个函数
    const fn = compose(this.middleware_list);
    // callback返回值必须符合http.createServer参数形式
    // 即 (req, res) => {}
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }

  handleRequest(ctx, fn) {
    const handleResponse = () => respond(ctx);
    return fn(ctx)
      .then(handleResponse)
      .catch((err) => console.log("Somethis is wrong: ", err));
  }

  // koa实际上扩展了 原生req，res
  createContext(req, res) {
    const context = Object.create(this.context);
    context.app = this;
    context.req = req;
    context.res = res;
    return context;
  }

  listen(...args) {
    // callback是传给http.createServer的回调函数，这个函数必须符合http.createServer的参数形式
    // function(req, res){}
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
};

/**
 * 1. 校验
 * 2. 包装promise
 */
function compose(middleware_list) {
  if (!Array.isArray(middleware_list)) {
    throw new TypeError("not an array!");
    for (const fn of middleware_list) {
      if (typeof fn !== "function") {
        throw new TypeError(" middleware must a function!");
      }
    }
  }

  return function fn(ctx, next) {
    return dispatch(0);
    function dispatch(i) {
      // 第i个中间件
      let fn = middleware_list[i];

      if (i === middleware_list.length) {
        // 这里让fn等于外部传进来的next，其实是进行收尾工作，比如返回404
        fn = next;
      }
      // 如果外部没有传收尾的next，直接就resolve
      if (!fn) {
        return Promise.resolve();
      }
      // 中间件里面调用next的时候其实调用的是dispatch(i + 1)，也就是执行下一个中间件
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
}

// 将网络请求返回
function respond(ctx) {
  const res = ctx.res;
  const body = ctx.body;
  return res.end(body);
}
