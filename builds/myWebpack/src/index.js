import _ from 'lodash';
import './style.css'
import SmallPic from './smallPic.png'
import Data from './data.xml'

/@__pure__/
function component() {
  var element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
document.body.appendChild(component());

// 在js中引入图片，通过file-loader打包资源
function imageComponent() {
  var elImg = new Image();
  elImg.src = SmallPic
  return elImg
}
document.body.appendChild(imageComponent())

console.log('xml中取得的数据为:\n', Data)