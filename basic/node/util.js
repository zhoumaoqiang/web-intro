const util = require('util')

// 继承
function Base() { 
  this.name = 'base'; 
  this.base = 1991; 
  this.sayHello = function() { 
  console.log('Base类私有方法, 打印name: ' + this.name); 
  }; 
} 
Base.prototype.showName = function() { 
  console.log("调用Base类原型上的方法，打印name: " + this.name);
}; 
function Sub() { 
  this.name = 'sub'; 
} 
util.inherits(Sub, Base); 
var objBase = new Base(); 
objBase.showName(); 
objBase.sayHello(); 
var objSub = new Sub(); 
objSub.showName(); 
// 原型上的方法将不会被打印出来


// 对象检查
// 目标对象、显示隐藏属性、递归层数、是否显示ascii编码颜色
console.log(util.inspect(Base, true, 1, true));

// 检查数据是否为数组
console.log(util.isArray("hello world"));
console.log(util.isArray([1, 2, 3]));

// 检查正则
console.log(util.isRegExp(/some regexp/));

// 检查日期对象
console.log(util.isDate(new Date()));

// 检查错误对象
console.log(util.isError(new TypeError()));

