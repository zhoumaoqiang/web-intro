# 学习手册

## python3安装

下载程序并安装，程序安装时会自动添加path，打开控制台输入python就可以进入python的shell。python是解释性语言，在shell中也可以完成基础的运算和支持python语法。想要退出执行`quit()`或者`exit()`。python的可执行文件，后缀名以`.py`结尾。

## 基础

### 输入输出

1. python中*输出*信息使用`print()`函数，其作用和用法类似于JS的`console.log()`函数。*输入*使用函数`input()`，解释器遇到该函数会停下，等待用户输入值，值输入完成后作为函数返回值。
2. `input()`返回的数据可以使用**变量**接收，python中变量可以直接书写，例如：`value=input()`。这样就声明并赋值一个变量value，变量声明后可以访问，如：`print(value)`。

### 语法

1. python的语法基础是采用缩进控制，缩进没有规定使用空格的数量或者使用tab，但是一般来说使用4个空格更加严谨。代码的每一行都是一条语句，语句如果以`:`结尾，缩进的语句则视为代码块。
2. python的注释，采用`#`标头。
3. python是大小写敏感的语言。

### 基础数据类型

- 整数：例如 20、3、-1、0、1000，十六进制 0xff00
- 浮点数：例如 3.14、-1.23、1.3e10
- 字符串：例如 '3a er7'、"I'm OK"、'''这里的内容可以换行，但输出单行字符串，否则使用\\n'''、'''这里也是多行字符串，修饰符r支持文本本身的换行功能'''
- 布尔值： 只有`True`和`False`，并且注意大小写，布尔值可以根据逻辑运算获得，或者布尔运算`and`、`or`、`not`获得。
- 空值：python中的空值使用`None`。

变量：变量的声明必须是大小写英文字母、数字和 _ 组合，并且不能以数字开头。  
常量：常量只是约定的写法，一般是使用全大写字母组成，python无法约束常量的值不改变。如：PI=3.14159265369

**注意**：python中整数运算总是精准的，包括除法，浮点数的计算可能不总是精确的。两个整数的运算，除法`/`总是获得浮点数，地板除`//`总是获得整数，也就是商的整数部分。

### 字符编码

python的字符编码是Unicode，python内置了一些方法将字符与编码大小进行转换。

`ord()`将字符装换成数字序列，`chr()`将数字序列转换成字符。例如 ord('A') => 65， chr(65) => 'A'。  
unicode模块携带的编码`encode()`和解码`decode()`方法也是支持的，可以传入指定编码格式，转换为bytes，表现为字符串前面使用`b`修饰，例如 'ABC'.encode('ascii') => b'ABC'。`decode()`可以传入第二个参数`erros='ignore'`，在无法识别无效字节时跳过。

`len()`函数获取字符串的长度，并返回。

`.py`文件在解释时，可在文件头部添加如下代码保证python解释器按照`utf-8`格式读取  
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
```

字符占位符：相当于在字符串中引用变量，通过传入的内容替换占位符号。其写法包括 `%s`(字符串)、`%d`(整数)、`%f`(浮点数)、`%x`(十六进制整数)。使用`%%`表示`%`，当类型不确定的时候，`%s`总是适用的。例如：  
```python
str_holder = 'Hi, %s, you have $%d.' % ('Michael', 1000000)
print(str_holder)
# 'Hi, Michael, you have $1000000.'
```
使用`format()`函数也可以达到字符占位的作用，好处是不用再写那么多的`%`，坏处是需要写传入数据次序和匹配模式的值，例如：  
```python
'Hello, {0}, 成绩提升了 {1:.1f}%'.format('小明', 17.125)
# 'Hello, 小明, 成绩提升了 17.1%'
```

### 列表和元组

python中的列表(list)同JS中的数组有点类似，但是也有区别。python中列表使用`[]`包围，值采用`,`分隔，可以存放不同数据类型的数据，可以更改长度，使用`len()`函数返回列表长度，可以使用`list[index]`访问元素，index可以为负数表示倒数，但是无论正数还是负数都不允许访问超过列表长度，否则就会报错。

列表的方法：  
```python
classmates = ['Michael','Bob','Tracy']
# 栈方法，删除和添加元素
classmates.pop()
classmates.append('Adam')
# 删除指定位置的数据
index = 1
classmates.insert(index, 'Tom')
classmates.pop(index)
# 数据替换
classmates[index] = 'Alan'
```

元组是一种有序列表，元组的数据元素使用`()`包围，并且一旦初始化就不能再被更改。由于元组使用`()`表示，所以为消除数学上小括号的歧义，当元组只有一个元素的时候，使用`,`消除歧义，例如：  
```python
tuple_multi = ('hello', 2, True)
tuple_one = (1,)
print(tuple_one)
```

### 条件

python使用`if...elif...else`进行条件判断，主要注意语法上控制缩进。python中条件判断的大小比较，不会对字符串和数字进行隐式转换。
```python
year = input('birth: ')
birth = int(year)
if birth < 1990:
    print('80后')
elif birth < 2000:
    print('90后')
    print('awesome')
else:
    print('00后')
```

### 循环

python中的循环有`for...in...`和`while`两种循环，为便于一定次数的循环，python还提供了`range(num)`函数生成从0到小于num的整数的列表。关键字`break`和`continue`在python中也是有效的，表示退出循环和跳至下一次循环。
```python
# 计算0-100的和
sum_for = 0
for x in range(101):
    sum_for = sum_for + x
print(sum_for)
n = 1
while n <= 100:
    n = n + 1
print('END', n)
```

### 字典和集合

字典(dict)也就是一般所说的map数据类型，采用键值对(key-value)存储数据，具有较快的查找速度。键必须是不可变对象(例如不能使用列表)，例如字符串、数字等，python会根据key计算出对应的值(哈希算法)。
```python
# 字典常用方法
dict_ = {"Adam": 100, "Bob": 82, "YY": 16}
dict_.pop("Bob") # 删除
dict_["Cherry"] = 95 # 赋值，如果没有该属性值且直接访问就会报错，所以可以使用get
dict_.get("Tris", 0) # 访问Tris的值，没有返回0
```

集合set接收有序不重复列表，重复元素的新增操作都是无效的。集合提供了`add()`方法添加数据，`remove()`删除数据，set是key的集合，两个set集合可以使用`&`和`|`求得交集和并集。

## 函数

### 内置函数

python有一系列的内置函数，比如之前使用过的`range()`、`print()`等，[这里](http://docs.python.org/3/library/functions.html)可以看到官网上提到的函数。  
例如：绝对值`abs()`、最大值`max()`，类型转换的一系列，转换成整数`int()`、浮点数`float()`、字符串`str()`、布尔值`bool()`。使用函数是需要注意，需要传入正确的参数个数和数据类型。

### 定义函数

函数支持用户自己定义和调用，使用关键字`def`，函数所有内容写在缩进中。使用函数或者其他包含缩进内容的语句时，可以使用pass占位，来避免报错。可以使用`isinstance()`函数来判断参数传入的类型，概述接收判断的参数和使用小括号包围的数据类型。python中的函数可以返回多个值，接收时按照元组的形式接收，也可以使用对应个数的变量接收。
```python
def my_abs(x):
    if not isinstance(x, (int, float)):
        raise TypeError('bad operand type')
    if x >= 0:
        return x, True
    else:
        return -x, False
my_abs(20)
```

### 函数参数

前面提到使用函数必须传入个数正确并且数据类型符合要求的参数，记得列表的`pop()`方法支持传入和不传入参数的形式，只是函数功能可能不同。实际上，函数参数有很多玩法，例如默认参数、可变参数等。

默认参数是在定义函数的时候，给定参数默认值，如果默认参数给定一个引用类型的数据，相当于这个数据是在函数外作用域内，所以不要给默认参数设置可变对象。写法为：  
```python
# 默认求得x的平方
def power(x, n=2):
    s = 1
    while n > 0:
        n = n - 1
        s = s * x
    return s
```

可变参数就是在定义函数或者使用函数的时候，参数的长度不做限制，使用`*`放在参数前，定义的时候会将传入的多个参数组装成列表或者元组的形式传递给可变变量，而使用的时候放在列表或元组前，转换成多个参数的形式。  
```python
def calc(*numbers):
    sum_result = 0
    for n in numbers:
        sum_result = sum_result + n * n
    return sum_result
calc(20, 50, 60)
array = [60, 0, -3, 80]
calc(array)
```

关键字参数用于字典数据，允许传入任意个键值对进行组装，使用`**`进行修饰，也可以限制传入属性，使用`*,`。
```python
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)
person('Michael', 30)
person('Adam', 45, gender='M', job='Engineer')
def person_only(name, age, *, city="Beijing", job):
    print(name, age, age, city, job)
```

### 递归函数

递归函数使用时需要注意栈溢出（开启新的函数使用了太多的栈），可以使用尾递归优化，也就是返回函数本身(这样就不会有新的函数，也就不会开辟新的栈)。  
```python
# 通过 n*f(n-1) 计算得到阶乘
def fact_over(n):
    if n==1:
        return 1
    return n * fact_over(n - 1)
# 通过 num*product 计算得到阶乘
def fact(n):
    return fact_iter(n, 1)

def fact_iter(num, product):
    if num == 1:
        return product
    return fact_iter(num - 1, num * product)
```

## 高级特性

### 切片

对字符串、列表或者元组截取一部分，python提供了切片的语法`list[start:end]`可以简化操作。  
```python
L = [0, 1, 20, 30, 50, 4, 32, 64, 72, 95]
sliceL = L[0:5]
sliceStart = L[:3]
sliceEnd = L[4:]
sliceStep = L[::3]
(0, 1, 2, 3, 4, 5)[:3]
str_ = 'HELLO WORLD'[:3]
print(str_)
```

### 迭代

一般来说，使用`for...in...`就可以满足列表、字典、元组甚至字符串等的迭代。对于字典`for key in list`迭代的是字典的键，要想迭代值可以使用`for value in dict.values()`，键值都想获取可以使用`for k,v in dict.items()`。这里的迭代实际是基于`Iterable`类型，所以可以判断数据是否为可迭代类型。  
```python
from collections import Iterable
isinstance('abc', Iterable)
isinstance([1,2,3], Iterable)
```
在python中，列表只有值，集合只有键，想要获得列表在迭代过程中的下标，可以使用enumerate函数。
```python
for i, value in enumerate(['A', 'B', 'C']):
    print(i, value)
```

