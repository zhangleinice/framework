/**
 * koa中间件实现原理
 */

const http = require("http");

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
    function dispatch(i) {
      let middleware = middleware_list[i];
      try {
        return Promise.resolve(middleware(ctx, dispatch.bind(null, i + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return dispatch(0);
  };
}

class Koa {
  constructor() {
    this.middleware_list = [];
  }

  callback() {
    const fn = compose(this.middleware_list);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }

  // 注册中间件
  use(middleware) {
    if (typeof middleware === "function") {
      this.middleware_list.push(middleware);
    }
    return this;
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
}

const app = new Koa();

app.use(async (ctx, next) => {
  console.log(1);
  await next();
});
