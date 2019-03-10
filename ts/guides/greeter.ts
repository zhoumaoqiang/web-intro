// 构造函数参数添加public，相当于创建同名变量
class Student {
  fullName: String;
  constructor(public firstName, public middleName, public lastName) {
    this.fullName = firstName + ' ' + middleName + ' ' + lastName
  }
}
// 接口用于注解Student类的实例
interface Person {
  firstName: String,
  lastName: String
}

let user = new Student('walter', 'zero', 'chow')

// 传入对象指定接口
function greeter(person: Person) {
  return 'Hello, ' + person.firstName + ' ' + person.lastName
}


document.body.innerHTML = greeter(user)