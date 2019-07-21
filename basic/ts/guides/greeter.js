// 构造函数参数添加public，相当于创建同名变量
var Student = /** @class */ (function () {
    function Student(firstName, middleName, lastName) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.fullName = firstName + ' ' + middleName + ' ' + lastName;
    }
    return Student;
}());
var user = new Student('walter', 'zero', 'chow');
// 传入对象指定接口
function greeter(person) {
    return 'Hello, ' + person.firstName + ' ' + person.lastName;
}
document.body.innerHTML = greeter(user);
