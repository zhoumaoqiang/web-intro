const fs = require('fs')

console.log(fileListCompare('./pti', '../oldDoc'))

// 获取相对路径下完整的文件目录
function getFileList(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file, index) => {
      let curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        files.splice(index, 1, {
          [file]: []
        })
        files[index][file] = getFileList(curPath, files[curPath])
      }
    })
  }
  return files
}
// 获取两个相对路径下文件目录的相对差异
function fileListCompare(path1, path2) {
  let files1 = getFileList(path1), files2 = getFileList(path2)
  let diff_list = files_compare(files1, files2)
  return diff_list

  // 只比较同级文件名
  function files_compare(files1, files2) {
    let diffs = []
    files1.forEach((file1, index) => {
      if(typeof file1 == 'string' &&  files2.indexOf(file1) == -1) {
        diffs.push({
          filename: file1,
          tag: 'more'
        })
      } else if(typeof file1 == 'object'){
  
        for(let key in file1) {

          let hasAttr = files2.some((item) => {
            if(typeof item == 'object' && item[key]) {
              diffs.push({
                [key]: files_compare(file1[key], item[key])
              })
              return true
            }
          })
          if(!hasAttr) {
            diffs.push({
              dirname: key,
              tag: 'more'
            })
          }
        }
      }
    })
    let temp = files1
    files1 = files2
    files2 = temp
    files1.forEach((file1, index) => {
      if(typeof file1 == 'string' &&  files2.indexOf(file1) == -1) {
        diffs.push({
          filename: file1,
          tag: 'less'
        })
      } else if(typeof file1 == 'object'){
        for(let key in file1) {
          let hasAttr = files2.some((item) => {
            if(typeof item == 'object' && item[key]) {
              let has_attr = diffs.some((diff) => {
                if(diff[key]) {
                  item[key].push({
                    [key]: files_compare(file1[key], item[key])
                  })
                  return true
                }
              })
              if(!has_attr) {
                diffs.push({
                  [key]: files_compare(file1[key], item[key])
                })
              }
              return true
            }
          })
          if(!hasAttr) {
            diffs.push({
              dirname: key,
              tag: 'less'
            })
          }
        }
      }
    })
    return diffs
  }
}


