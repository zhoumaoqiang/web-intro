// let n:number 
// console.log(n)

let num:number = 10
console.log(num)

function getInfo(name:string):string;
function getInfo(age:number):number;
function getInfo(info:any):any {
  if(typeof info === 'string') {
    return `my name is ${info}`
  } else {
    return info
  } 
}

