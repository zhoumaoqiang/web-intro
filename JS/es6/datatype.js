// 直接输入全球码
console.log('\\ufa5a', '\ufa5a')
console.log('\\uD842\\uDFB7', '\uD842\uDFB7')

// 兼容的全球码表示法
console.log('\\u{42}', '\u{42}')

console.log('你'.charCodeAt())   // 返回utf8字符码点，结果为十进制
console.log(String.fromCharCode(20320))
console.log('𠮷'.codePointAt())  // 返回utf16字符码点，十进制结果
console.log(String.fromCodePoint(134071))

// 查找匹配
console.log('hello'.startsWith('H'))    // false
console.log('hello'.endsWith('o'))      // true
console.log('hello'.includes('l'))      // true

// 字符复核
console.log('重复：', 'xy'.repeat(5))

// 字符填充
console.log('x'.padStart(5, 'ab'))  // 填充后字符长度，以及填充使用材料
console.log('x'.padEnd(5, 'ab')) 

let vary = '变量——'
console.log(`
    模板字符串，支持换行
    支持'', ""
    变量解析 ${vary}
`)

// 自动转义

console.log(String.raw('使用\n换行'))