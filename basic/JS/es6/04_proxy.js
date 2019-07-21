// Reflect 对象是Object对象在语言内部层次进行操作显示的对象
// 使用Proxy和Reflect的目的都是一定层度上修改语言内部提供的特性
// 接受两个对象，原对象和处理配置

// 对象代理操作，可以设置在对象实例的proxy属性，或者对象原型上，这样更具通用性

var obj = new Proxy({}, {
    // proxy暴露的可操作性特性包括
    // get、set、has、deleteProperty、ownKeys、getOwnPropertyDescriptor、defineProperty、
    // preventExtensions(组织扩展)、isExtensible、getPropertyOf、setPropertyOf、apply、construct

    // 下面使用Reflect的方法，并且参数直接全部传递，这样的拦截是没有任何修改的
    // 实际运用时会加上一些改动，实现真正的代理功能


    get: function (target, key, receiver) {
        // 可以被继承
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },

    // 当设置对象属性writable为false是，代理设置的set将无效，并且在尝试设置属性值时会报错
    set: function (target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(...arguments);
    },

    // 这样proxy的实例就会调用apply方法中的运算，用于拦截call、apply方法
    apply: function (target, ctx, args) {
        return Reflect.apply(...arguments)
    },

    // 用于拦截hasProperty，例如限定私有属性
    has: function(target, key) {
        // 如果对象禁止拓展，那么不能隐藏对象属性 Object.preventExtensions(obj)
        if(key[0] == '_') {
            return false
        }
        return key in target
    },

    // 用于拦截new命令，必须返回一个对象
    construct: function(target, args, newTarget) {
        return new target(...args)
    },

    // 用于拦截 delete 命令，例如拦截私有属性的删除
    deleteProperty: function(target, key) {
        if(key[0] == '_') {
            return false
        }
        delete target[key]
        return true
    },

    // getOwnPropertyDescriptor、defineProperty拦截原本提供的方法，接收target、key、（descriptor）

    // 拦截 Object.isExtensible
    isExtensible: function(target) {
        return true
    },
    preventExtensions: function(target){
        return false
    },

    // getPrototypeOf, setPrototypeOf用于获取和设置原型，拦截实例同名方法，接收target、(proto)

    // 拦截遍历方法，除开：实际返回但目标对象不存在属性、Symbol、enumerable属性
    ownKeys: function(target) {
        return Reflect.ownKeys(target).filter(key => key[0] !== '_')
    }

});

obj.title = "hello world"; // setting title
console.log(obj.title) // getting title    hello world

// 上面使用defineProperty同样有效 !! Vue2 -> Vue3


// 取消proxy实例

var target = {};
var handler = {};

var {proxy, revoke} = Proxy.revocable(target, handler);
proxy.foo = 123;
revoke();

// 无法再访问proxy.foo，由于代理权回收，此时proxy是可以访问的，代理的对象实例也是可访问的，但是其相关设置就不行了