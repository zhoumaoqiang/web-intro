const fs = require('fs')
const path = require('path')

// 页面中用于操作的 DOM
const originFolderText = document.querySelector('#originFolderText'),
    originFolderSelector = document.querySelector('#originFolderSelector'),
    originFileList = document.querySelector('#originFileList'),
    newFolderText = document.querySelector('#newFolderText'),
    newFolderSelector = document.querySelector('#newFolderSelector'),
    newFileList = document.querySelector('#newFileList');

let origins = null,
    news = null,
    globalIndex = 0;
let moreFileList = []

handler()

function handler() {

    originFolderSelector.addEventListener('change', function (e) {
        let selectPath = this.files[0].path
        originFolderText.value = selectPath
        origins = getFileList(selectPath, true)
        originFileList.innerHTML = renderList(origins, 'file')
        if (news) {
            resetOpenStatus(news)
            newFileList.innerHTML = renderList(news, 'file')
        }
        compare()
    })

    newFolderSelector.addEventListener('change', function (e) {
        let selectPath = this.files[0].path
        newFolderText.value = selectPath
        news = getFileList(selectPath, false)
        newFileList.innerHTML = renderList(news, 'file')
        resetOpenStatus(news)
        if (origins) {
            resetOpenStatus(origins)
            newFileList.innerHTML = renderList(origins, 'file')
        }
        compare()
    })

    document.querySelector('.wrapper').addEventListener('click', function (e) {
        // 点击开关切换状态
        if (!/switch/.test(e.target.className)) {
            return
        }
        let data = e.target.dataset
        if (e.pageX / window.innerWidth < 0.5) {
            if (data.originindex) {
                switchOpenStatus(data.originindex, true)
            } else if (data.newindex) {
                switchOpenStatus(data.newindex, false)
            }
        } else if (e.pageX / window.innerWidth > 0.5) {
            if (data.newindex) {
                switchOpenStatus(data.newindex, false)
            } else if (data.originindex) {
                switchOpenStatus(data.originindex, true)
            }
        }

    })

    originFileList.addEventListener('scroll', function (e) {
        // throttle((e) => {
        newFileList.scrollTop = e.target.scrollTop
        // }, 200)
    })

    newFileList.addEventListener('scroll', function (e) {
        // throttle((e) => {
        originFileList.scrollTop = e.target.scrollTop
        // }, 200)
    })

}

function compare() {
    // 清空增量文件记录
    moreFileList = []
    if (origins && news) {
        if (origins[0] && origins[0].children && news[0] && news[0].children) {
            results = fileListCompare(origins[0].children, news[0].children)
            recordFileList()
            originFileList.innerHTML = renderList(origins, 'file')
            newFileList.innerHTML = renderList(news)
        }
    }
}

function recordFileList() {
    formatMoreFileList()
    sessionStorage.autoFileList = JSON.stringify(moreFileList)
}

function formatMoreFileList() {
    moreFileList = [...new Set(moreFileList)]

}


function renderList(list, mode, n) {
    let str = ''
    if (!n) {
        n = 0
    }
    if (!mode) {
        mode = 'compare'
    }
    list.forEach((item) => {
        if (item.children) {
            str += `<li class='folder-list-container'>
                <p class="folder 
                    ${(item.tag == 'less' && mode == 'file') 
                        ? 'grey-for-less' 
                        : (item.tag == 'less' && mode == 'compare')
                            ? 'red-for-less' : (item.tag == 'more' && mode == 'compare') 
                                ? 'green-for-more' : ''}">
                    ${getBlank(n)}
                    <span class="switch" data-originindex=${item.originIndex} data-newindex=${item.newIndex}>${item.open ? '-' : '+'}</span>
                    <span>${item.name}</span>
                </p>
                ${item.open === false ? '' :`<ul>${renderList(item.children, mode, n+1)}</ul>`}
            </li>`
        } else {
            str += `<li class="file 
                    ${(item.tag == 'less' && mode == 'file') 
                        ? 'grey-for-less' 
                        : (item.tag == 'less' && mode == 'compare')
                            ? 'red-for-less' : (item.tag == 'more' && mode == 'compare') 
                                ? 'green-for-more' : ''}">
                ${getBlank(n)}
                · ${item.name}
            </li>`
        }
    })
    return str
}

function getBlank(n) {
    let str = ''
    for (let i = 0; i < n; i++) {
        str += '&nbsp;&nbsp;'
    }
    return str
}

function switchOpenStatus(clickedIndex, isOrigin) {

    if (isOrigin) {
        changeStatus(origins, {
            originIndex: clickedIndex
        })
        if (news) {
            changeStatus(news, {
                originIndex: clickedIndex
            })
            compare()
        } else {
            originFileList.innerHTML = renderList(origins)
        }
    } else {
        changeStatus(news, {
            newIndex: clickedIndex
        })
        if (origins) {
            changeStatus(origins, {
                newIndex: clickedIndex
            })
            compare()
        } else {
            newFileList.innerHTML = renderList(news)
        }
    }

    function changeStatus(arr, condition) {
        let key = Object.keys(condition)[0]
        let value = condition[key]

        arr.some((item) => {
            if (item[key] == value) {
                item.open = !item.open
                return true
            }
            if (item.children && item.children.length > 0) {
                changeStatus(item.children, condition)
            }
        })
    }

}

function resetOpenStatus(arr) {
    arr.forEach((item) => {
        if (item.open === false) {
            item.open = true
        }
        if (item.children) {
            resetOpenStatus(item.children)
        }
    })
}

// 获取文件列表
function getFileList(selectPath, isOrigin) {
    let curPathName = selectPath.split(path.sep)[selectPath.split(path.sep).length - 1]
    let files = fsList(selectPath)
    let formatFiles = formatFsList(files)

    return [{
        base: selectPath,
        name: curPathName,
        children: formatFiles
    }]

    // 转换成layui树形结构格式
    function formatFsList(files) {
        files = files.map((file) => {
            if (typeof file == 'string') {
                return {
                    name: file,
                    base: files.base
                }
            } else if (file instanceof Object) {
                // console.log(file)
                let key = Object.keys(file)[0]
                return {
                    name: key,
                    open: true,
                    originIndex: isOrigin ? globalIndex++ : -1,
                    newIndex: isOrigin ? -1 : globalIndex++,
                    children: formatFsList(file[key]),
                    base: files.base
                }
            }
        })
        return files
    }

    // 获取文件列表
    function fsList(absPath) {
        let files = []
        if (fs.existsSync(absPath)) {
            files = fs.readdirSync(absPath)
            files.forEach((file, index) => {
                let curPath = absPath + '\\' + file
                files.base = curPath
                if (fs.statSync(curPath).isDirectory()) {
                    files.splice(index, 1, {
                        [file]: []
                    })
                    files[index][file] = fsList(curPath)
                }
            })
        }
        return files
    }
}

// 比较文件列表，直接改变结构
function fileListCompare(originFolder, newFolder, tag) {

    originFolder.forEach((originFile, originIndex) => {

        // 如果上级目录已经不同，就不用再比下级了
        if (tag == 'more') {
            originFile.tag = 'more'

            if (originFile.children) {
                newFolder.push({
                    name: originFile.name,
                    tag: 'less',
                    open: true,
                    newIndex: globalIndex++,
                    originIndex: originFile.originIndex,
                    children: []
                })
                fileListCompare(originFile.children, newFolder[originIndex].children, 'more')
            } else {
                newFolder.push({
                    name: originFile.name,
                    tag: 'less'
                })
            }
            return
        }


        let searchInNewFolder = newFolder.some((newFile) => {
            if (originFile.name == newFile.name) {
                // 名字相同，比较是否均为文件或者均为文件夹
                if (originFile.children && newFile.children) {
                    newFile.originIndex = originFile.originIndex
                    fileListCompare(originFile.children, newFile.children)
                    return true
                }
                if (!originFile.children && !newFile.children) {
                    return true
                }
            }
        })
        // origin 存在 且 new 不存在
        if (!searchInNewFolder) {
            originFile.tag = 'more'
            if (originFile.children) {
                newFolder.splice(originIndex, 0, {
                    name: originFile.name,
                    tag: 'less',
                    open: true,
                    newIndex: globalIndex++,
                    originIndex: originFile.originIndex,
                    children: []
                })
                fileListCompare(originFile.children, newFolder[originIndex].children, 'more')
            } else {
                newFolder.splice(originIndex, 0, {
                    name: originFile.name,
                    tag: 'less'
                })
            }
        }
    })

    newFolder.forEach((newFile, newIndex) => {

        // 如果上级目录已经不同，就不用再比下级了
        if (tag == 'less') {
            newFile.tag = 'more'
            if (newFile.children) {
                originFolder.push({
                    name: newFile.name,
                    tag: 'less',
                    open: true,
                    originIndex: globalIndex++,
                    newIndex: newFile.newInfex,
                    children: []
                })
                fileListCompare(originFolder[newIndex].children, newFile.children, 'less')
            } else {
                // 当右边确定是文件，且坐标文件中不存在时
                moreFileList.push(newFile.base + '\\' +newFile.name)

                originFolder.push({
                    name: newFile.name,
                    tag: 'less'
                })
            }
            return
        }


        let searchInOriginFolder = originFolder.some((originFile) => {
            if (originFile.name == newFile.name) {
                // 名字相同，比较是否均为文件或者均为文件夹
                if (originFile.children && newFile.children) {
                    originFile.newIndex = newFile.newIndex
                    fileListCompare(originFile.children, newFile.children)
                    return true
                }
                if (!originFile.children && !newFile.children) {
                    return true
                }
            }
        })
        // new 存在 且 origin 不存在
        if (!searchInOriginFolder) {
            newFile.tag = 'more'

            if (newFile.children) {
                originFolder.splice(newIndex, 0, {
                    name: newFile.name,
                    tag: 'less',
                    open: true,
                    originIndex: globalIndex++,
                    newIndex: newFile.newInfex,
                    children: []
                })
                if (newFile.children.length > 0) {
                    fileListCompare(originFolder[newIndex].children, newFile.children, 'less')
                }
            } else {
                // 当文件比较，右边存在且左边不存在时
                moreFileList.push(newFile.base + '\\' + newFile.name)

                originFolder.splice(newIndex, 0, {
                    name: newFile.name,
                    tag: 'less'
                })
            }
        }
    })
}