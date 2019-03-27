// Reflect 对象是Object对象在语言内部层次进行操作显示的对象
// 使用Proxy和Reflect的目的都是一定层度上修改语言内部提供的特性
// 接受两个对象，原对象和处理配置
var obj = new Proxy({}, {
  get: function (target, key, receiver) {
    // 可以被继承
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.title = "hello world";  // setting title
console.log(obj.title)  // getting title    hello world

// 上面使用defineProperty同样有效 !! Vue2 -> Vue3

// proxy暴露的可操作性特性包括
// get、set、has、deleteProperty、ownKeys、getOwnPropertyDescriptor、defineProperty、
// preventExtensions(组织扩展)、isExtensible、getPropertyOf、setPropertyOf、apply、construct

// 对象代理操作，可以设置在对象实例的proxy属性，或者对象原型上，这样更具通用性

