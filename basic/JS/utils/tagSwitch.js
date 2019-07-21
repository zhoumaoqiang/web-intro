// AMD: Asynchronous Module Definition，即异步模块加载机制

/**
 * @param {string} moduleName 第一个参数是模块标识名，可省略
 * @param {array} moduleDependencies 模块依赖的数组，可省略
 * @param {function} moduleFactoryObject 模块实现的实例
 */
// define([
//   'require',
//   'dependency'
// ], function(require, factory) {
//   'use strict';
  
// });

// 1. 不考虑属性值或者标签中的 < 、> ，传入是采用转义字符
function createTagStyle(htmlStr) {

  let input = htmlStr, isAttrStr = false;
  let inputArr = [];

  function output() {
    if(!valid) return input;
    str2array();
    let result = "";
    // 属性转义
    if(isAttrStr) {
      result = setAttr(inputArr)
    } else {
      result = inputArr.join("")
    }
    return result;
  }

  function setAttr(arr) {
    let resultArr = arr.map(function(item) {
      let i = item.indexOf('=');
      if(i == -1) {
        return `<span class="attr-name">${item}</span>`
      } else {
        return `<span>${item.slice(0, i)}</span>=<span>${item.slice(i+1)}</span>`
      }
    })
    return resultArr.join(' ')
  }

  function valid() {
    if(!isAttrStr && /<.>.*<.>/.test(input)) {
      return true;
    }
    // 属性转换始终验证成功
    return isAttrStr;
  }

  function str2array() {
    if(isAttrStr) {
      input = input.replace(/ +/g, " ").trim();  // 多个空格转换成一个
      inputArr = input.split(" ");
    }
    if(!isAttrStr) {
      inputArr = [], tabCount = -1;
      inputArr = input.split(">").map(function(item, index) {
        let transfer = '';
        // 结束标签
        if(item.indexOf("</") > -1) {
          tabCount -= 1;
          transfer = createTabs(tabCount) + item.slice(0, item.indexOf("</")) + "<br>"
            + createTabs(tabCount) + "&lt;/"
            + `<span class="tag-name">${item.slice(item.indexOf("</")+2, item.length)}</span>`
            + "&gt;"
            + "<br>";
        } else {  // 开始标签
          tabCount += 1;
          let text =  item.slice(0, item.indexOf("<")), 
          tag = item.slice(item.indexOf("<")+1, item.indexOf(" ", item.indexOf("<"))),
          attr = item.slice(item.indexOf(" ", item.indexOf("<")), item.length-1);

          transfer = createTabs(tabCount) + text + "<br>" 
            + createTabs(tabCount) + "&lt;"
            + `<span class="tag-name">${tag}</span>` + " "
            + setAttr(attr.replace(/ +/g, " ").trim().split(" "))
            + "&gt;"
            + "<br>"
        }
        return transfer;
      })
    }
    return inputArr;
  }

  function createTabs(count) {
    let tabs = "", tabSize = 2;
    for(let i = 0; i < count * tabSize; i++) {
      tabs += "&nbsp;"
    }
    return tabs;
  }

  output.attr = function(str) {
    if(!arguments.length) return str;
    htmlStr = str;
    isAttrStr = true;
    return output;
  }

  output.html = function(str) {
    if(!arguments.length) return str;
    htmlStr = str;
    isAttrStr = false;
    return output;
  }

  return output;
}

let str = `
<svg width="100%" height="100%">
  <circle id="mycircle" cx="50" cy="50" r="50" />
</svg>`

let result = createTagStyle(str)()
console.log(result)