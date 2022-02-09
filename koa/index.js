// const Koa = require("koa");
const Koa = require("./mykoa");
const app = new Koa();

/**
 *  洋葱模型
 *  没有next就不会执行下一个中间件
 *  中间件挨个入栈，最后一个中间件执行完毕，依次出栈（所以会反向回来）
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

// 洋葱模型为什么会回来？ 其实就是函数调用栈，函数执行完毕esp指针下移
function a() {
  console.log(5);
  b();
  console.log(555);
}

function b() {
  console.log(6);
  c();
  console.log(666);
}

function c() {
  console.log(7);
}

a(); // 5, 6, 7, 666, 555
