const Koa = require("koa");
const app = new Koa();

/**
 *  洋葱模型
 *
 */
app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(11);
});
app.use(async (ctx, next) => {
  console.log(2);
  await next();
  console.log(22);
});
app.use(async (ctx, next) => {
  console.log(3);
  await next();
  console.log(33);
});

// 输出 1， 2， 3, 33， 22， 11

app.use(async (ctx, next) => {
  ctx.body = "hello word";
});

app.listen(8000);
