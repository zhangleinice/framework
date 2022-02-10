const delegate = require("delegates");

/**
 *
 * 将对象的操作委托到对象的属性上
 * 原理 getter, setter | __defineGetter__, __defineSetter__
 *
 * @param {*} proto 原对象
 * @param {*} target 对象的属性
 * @returns
 */
function Delegator(proto, target) {
  // 忘记写new 调用
  if (!(this instanceof Delegator)) return new Delegator(proto, target);

  this.proto = proto;
  this.target = target;

  this.methods = [];
  this.getters = [];
  this.setters = [];
  this.fluents = [];
}

Delegator.prototype.getter = function (name) {
  var proto = this.proto;
  var target = this.target;

  this.getters.push(name);

  //! __defineGetter__ : 请注意，该方法是非标准的,建议通过 Object.defineProperty 实现同样功能
  // 在已存在的对象上添加可读属性
  //   proto.__defineGetter__(name, function () {
  //     return this[target][name];
  //   });

  Object.defineProperty(proto, name, {
    get: function () {
      return this[target][name];
    },
  });
  return this;
};

Delegator.prototype.setter = function (name) {
  var proto = this.proto;
  var target = this.target;

  this.setters.push(name);

  Object.defineProperty(proto, name, {
    set: function (val) {
      this[target][name] = val;
    },
  });

  return this;
};

Delegator.prototype.method = function (name) {
  var proto = this.proto;
  var target = this.target;

  this.methods.push(name);

  proto[name] = function () {
    return this[target][name].apply(this[target], arguments);
  };

  return this;
};

Delegator.prototype.access = function (name) {
  return this.getter(name).setter(name);
};

module.exports = delegate;

const obj = {
  a: {
    b: 1,
  },
};

// getter
Delegator(obj, "a").getter("b");
// console.log(obj.b); // 1

// setter
// new Delegator(obj, "a").setter("b");
// obj.b = 2;
// console.log(obj.a.b); // 2
