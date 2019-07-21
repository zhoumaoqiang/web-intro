const fs = require('fs')
const path = require('path')
const crypto = require('crypto');


// v1.0.0 2019-4-8
// 封装文件比较的类，定义两个文件夹路径，直接调用暴露的比较方法比对文件目录，以及具体文件的差异
class FilesCompare {
    /**
     * 传入文件夹的路径，可以获得path2相对于path1下文件目录的变更情况
     * @param {string} path1 这个一个基准文件的路径，文件比对的功能已该路径下的文件为基准
     * @param {string} path2 这是变更文件的路径，相对于path1的文件，该文件目录下的文件，必须具有“相同”、“不同”或者“新增”的标记
     */
    constructor(path1, path2) {
        this.path1 = path1
        this.path2 = path2
        this.fileList1 = []
        this.fileList2 = []
        
        this._intersection = [] // 交集，相同文件目录
        this._unionset = [] // 并集，所有的文件清单，用于展示
        this._diffset = []  // 差集，新增文件

        this._fileCompareList = []  // 相同文件需要进行md5比较的清单
        this._fileDiffCmList = []   // 相同文件完成md5比较后的结果清单
        this._fileMoreList = [] // 增量文件清单
        this.diffFileList = []

        this.intervalId = null
        this.compareFinished = []

        this._globalIndex = 0
        this._fsListShow1 = []
        this._fsListShow2 = []
    }
    
    /**
     * 比较文本，在回调中返回比较结果
     * @param {string} file1 第一个文件的绝对路径
     * @param {string} file2 第二个文件的绝对路径
     * @param {string} algo  可选，表示加密规则，默认为md5
     * @param {function} callback 比较完成的回调函数
     */
    fileCompare(file1, file2, callback) {
        if(!fs.existsSync(file1) || !fs.existsSync(file2)) {
            throw Error('ParamError: file path is not exsit')
        }
        let algo = 'md5'
        
        // 返回最终的比较结果
        computeHash(file2, algo, function (file2hash, err) {
            if (err) {
               callback(false, err);
            } else {
               computeHash(file1, algo, function (file1hash, err) {
                  callback(file1hash === file2hash, err);
               });
            }
        });

        // 读取文件数据，计算 hash，并在回调中返回值
        function computeHash(filename, algo, callback) {
            let chksum = crypto.createHash(algo);
            let s = fs.ReadStream(filename);
            s.on('error', function (err) {
                callback(0, err);
            });
            s.on('data', function (d) {
                chksum.update(d);
            });
            s.on('end', function () {
                let d = chksum.digest('hex');
                callback(d);
            });
        }
    };
    // 当同文件列表存在时，比较同文件列表文件md5，由于是异步操作，支持选择性传入回调
    fileListCompare(callback) {
        // 如果有比对文件，则异步比对 ，否则直接调用回调
        if(this._fileCompareList.length > 0) {
            this.compareFinished = []
            this._fileCompareList.forEach((item, index) => {
                if(item.isEmptyDict) {
                    item.isSame = true
                    return
                }
                this.compareFinished.push(false)
                this.fileCompare(item.origin, item.new, (result) => {
                    // 异步操作的返回结果，与顺序无关，所以每个完成状态都需要记录
           
                    this.compareFinished[index] = true
                    
                    item.isSame = result
                })
            })
            setTimeout(() => {
                this.intervalId = setInterval(() => {
                    // 比较结果包含false 为 false 时
                    if(!this.compareFinished.includes(false)) {
                        this.compareFinished = []
                        this._fileDiffCmList = this._fileCompareList.filter(item => item.isSame==false).map((item) => {
                            return item.new
                        })
                        if(callback && callback instanceof Function) {
                            callback()
                        }
                        if(this.intervalId) {
                            clearInterval(this.intervalId)
                        }
                    }
                }, 20)

            }) 

        } else {
            callback()
        }
    }
    // 封装的获取文件列表的方法
    getFileList(selectPath) {
      
        let curPathName = selectPath.split(path.sep)[selectPath.split(path.sep).length - 1]
        let fileList = [{
            [curPathName]: fsList(selectPath)
        }]
        fileList.base = selectPath
        fileList.curPath = curPathName

        // base为当前文件或者文件夹的绝对路径，文件夹名作为键，对应文件夹目录下的文件列表
        return fileList
    
        // 获取文件列表，递归获取文件夹下的文件，采用多维数组的方法表示
        function fsList(absPath) {
            let files = []
            if (fs.existsSync(absPath)) {
                files = fs.readdirSync(absPath)
                files.forEach((file, index) => {
                    // 对于每一层级，添加当前文件夹的绝对路径属性
                    files.base = absPath
                    // 判断当前遍历完整路径是否为文件夹
                    let curPath = absPath + '\\' + file
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
    getFileList1() {
        this.fileList1 = this.getFileList(this.path1)
        this._fsListShow1 = this.formatFsList(this.fileList1[0][this.fileList1.curPath], true)
    }
    getFileList2() {
        this.fileList2 = this.getFileList(this.path2)
        this._fsListShow2 = this.formatFsList(this.fileList2[0][this.fileList2.curPath])
    }
    // 文件夹比较，获取同目录同名文件进行文件md5比对、fileList2多出的文件
    dictCompare(callback) {
        // 检查两个文件路径下的文件列表
        if(this.fileList1.length <= 0) {
            try {
                this.fileList1 = this.getFileList(this.path1)
                this._fsListShow1 = this.formatFsList(this.fileList1[0][this.fileList1.curPath], true)
                if(this.fileList1.length <= 0) {
                    console.warn('there is no file in path1 dictionary!')
                }
            } catch(e) {
                throw Error('ParamError: path1 is required.')
            }
        }
        if(this.fileList2.length <= 0) {
            try {
                this.fileList2 = this.getFileList(this.path2)
                this._fsListShow2 = this.formatFsList(this.fileList2[0][this.fileList2.curPath])
                if(this.fileList2.length <= 0) {
                    throw Error('DataError: you must get files of path2 dictionary!')
                }
            } catch(e) {
                throw Error('ParamError: path2 is required.')
            }
        }

        // 获取 fileList2 相对于 fileList1 的交集和差集，求并集用于完整显示
        // 获取差集
        let fl1Children = this.fileList1[0][this.fileList1.curPath], fl2Children = this.fileList2[0][this.fileList2.curPath]
        this._diffset = getMoreFiles(fl2Children, fl1Children)
        this._fileMoreList = this.getFileStrFromArray(this._diffset).filter(item => item != null)
        // 获取交集，并对相同文件进行文件比对
        this._intersection = getSameFiles(fl2Children, fl1Children)
        this._fileCompareList = this.getFileStrFromArray(this._intersection).filter(item => item != null)
        this.fileListCompare(() => {
            this.diffFileList = this._fileMoreList.concat(this._fileDiffCmList)
            this.diffFileList = this.diffFileList.map((item) => {
                return item.replace(this.path2, '')
            })
            if(callback instanceof Function) {
                callback()
            }
        })

        // 获取两者都拥有的文件，并且记录可以对比的标准、新增文件
        function getSameFiles(files2, files1) {
            return files2.map((item) => {
                // 文件列表格式：字符串为文件，对象为文件夹，键为文件夹名称，绝对路径为数组的base属性
                if(typeof item == 'string') {
                    if(files1.includes(item)) {
                        return {
                            origin: files1.base + '\\' + item,
                            new: files2.base + '\\' + item
                        }
                    } else {
                        return null
                    }
                } else if(typeof item == 'object') {
                    let dictName = Object.keys(item)[0]
                    let result = null
                    files1.some((file1) => {
                        if(typeof file1 == 'object' && file1[dictName]) {
                            if(file1[dictName].length == 0 && item[dictName].length == 0) {
                                result = {
                                    origin: files1 + '\\' + dictName,
                                    new: files2 + '\\' + dictName,
                                    isEmptyDict: true
                                }
                            } else {
                                result = getSameFiles(item[dictName], file1[dictName])
                            }
                            return true
                        }
                    })
                    return result
                }

            })
        }
        // 记录新增的文件，只记录 files2 存在且 files1 不存在的
        function getMoreFiles(files2, files1) {
            return files2.map((item) => {
                // 当只有files2才具有文件时，获取文件全路径
                if(typeof item == 'string') {
                    if(!files1.includes(item)) {
                        return files2.base + '\\' + item
                    } else {
                        return null
                    }
                } else if(typeof item == 'object') {
                    let dictName = Object.keys(item)[0] // 获取文件夹名
                    let result = null
                    
                    let findDict = files1.some((file1) => {
                        // 文件夹均存在，调用该方法继续比较
                        if(typeof file1 == 'object' && file1[dictName]) {
                            if(file1[dictName].length == 0 && item[dictName].length == 0) {
                                return false
                            } else {
                                result = getMoreFiles(item[dictName], file1[dictName])
                                return true
                            }
                        }
                        
                    })
                    // 文件夹2存在且1不存在，里面的所有文件全部返回
                    if(!findDict && item[dictName].length > 0) {
                        return getAllFilesOfDict(item[dictName])
                    } else {
                        return result
                    }
                }
            })
        }
        // 当文件夹都是多出的文件时，根据文件夹完整目录获取文件列表
        function getAllFilesOfDict(dictList) {
            let fileList = []
            getFiles(dictList)
            return fileList
            function getFiles(arr) {
                // console.log(arr)
                arr.forEach((item) => {
                    if(typeof item == 'string') {
                        fileList.push(arr.base + '\\' + item)
                    } else {
                        let dictName = Object.keys(item)[0]
                        getFiles(item[dictName])
                    }
                })
            }
        }
    }

    getFileStrFromArray(fileList) {
        let fileStr = []
        getFiles(fileList)
        return fileStr
        function getFiles(arr) {
            arr.forEach((item) => {
                if(Array.isArray(item)) {
                    getFiles(item)
                } else {
                    fileStr.push(item)
                }
            })
        }
    }

    // 将文件路径格式化成相对路径
    formatDiffFileList(path) {
        if(!path) {
            path = this.path2
        }
        this.diffFileList.forEach((item) => {
            item = item.replace(path, "").replace('\\', '/')
        })
    }

    // 重置一方的数据
    resetFiles() {
        this.fileList1.length = 0
        this.fileList2.length = 0
        this._intersection.length = 0
        this._diffset.length = 0
        this._fileCompareList.length = 0
        this._fileDiffCmList.length = 0
        this._fileMoreList.length = 0
        this.diffFileList.length = 0
        this._fsListShow1.length = 0
        this._fsListShow2.length = 0
    }
    // =============================================== 用于显示的方法

    // 对于用于显示的数据处理，直接移植原处理方法
    /**
     * 格式化 fileList，变成用于生成列表的格式
     * @param {array} files 格式化的数组，用于转换成便于显示的格式
     * @param {boolean} isCompared 传入数组是否为被比较的文件列表
     */
    formatFsList(files, isCompared) {
        files = files.map((file) => {
            if (typeof file == 'string') {
                return {
                    name: file,
                    base: files.base
                }
            } else if (file instanceof Object) {
            
                let dictName = Object.keys(file)[0]
                return {
                    name: dictName,
                    open: true,
                    originIndex: isCompared ? this._globalIndex++ : -1,
                    newIndex: isCompared ? -1 : this._globalIndex++,
                    children: this.formatFsList(file[dictName]),
                    base: files.base
                }
            }
        })
        return files
    }

    // 数据列表中，开关状态的切换和重置
    resetOpenStatus(arr) {
        arr.forEach((item) => {
            if (item.open === false) {
                item.open = true
            }
            if (item.children) {
                this.resetOpenStatus(item.children)
            }
        })
    }
        // origin表示path1对应的文件列表
    /**
     * 联动切换两个数组的开关属性
     * @param {number} clickedIndex 显示的两个比较文件的列表，分别有两个对应的序列号，这里是传入的序列号
     * @param {boolean} isCompared 指明传入序列号是否属于被比较的一方
     */
    switchOpenStatus(clickedIndex, isCompared) {

        if (isCompared) {
            changeStatus(this._fsListShow1, {
                originIndex: clickedIndex
            })
            if (this._fsListShow2.length > 0) {
                changeStatus(this._fsListShow2, {
                    originIndex: clickedIndex
                })
            } 
        } else {
            changeStatus(this._fsListShow2, {
                newIndex: clickedIndex
            })
            if (this._fsListShow1.length > 0) {
                changeStatus(this._fsListShow1, {
                    newIndex: clickedIndex
                })
            }
        }
    
        function changeStatus(arr, condition) {
            // 判断依据是使用originIndex 还是 newIndex
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

    /**
     * 展示文件目录的比较，同步两方目录并标记，以作显示
     * @param {array} showFsList1 被比较的文件列表数组，this._fsListShow1
     * @param {array} showFsList2 用于比较的文件列表数组，this._fsListShow2
     * @param {string} tag [optional] 比较文件夹时，标记文件夹的差异，以优化比较过程
     */
    fsListShowCompare(showFsList1, showFsList2, tag) {

        showFsList1.forEach((originFile, originIndex) => {
    
            // 如果上级目录已经不同，就不用再比下级了
            if (tag == 'more') {
                originFile.tag = 'more'
    
                if (originFile.children) {
                    showFsList2.push({
                        name: originFile.name,
                        tag: 'less',
                        open: true,
                        newIndex: this._globalIndex++,
                        originIndex: originFile.originIndex,
                        children: [],
                        base: originFile.base
                    })
                    this.fsListShowCompare(originFile.children, showFsList2[originIndex].children, 'more')
                } else {
                    showFsList2.push({
                        name: originFile.name,
                        tag: 'less',
                        base: originFile.base
                    })
                }
                return
            }
    
    
            let searchInNewFolder = showFsList2.some((newFile) => {
                if (originFile.name == newFile.name) {
                    // 名字相同，比较是否均为文件或者均为文件夹
                    if (originFile.children && newFile.children) {
                        newFile.originIndex = originFile.originIndex
                        this.fsListShowCompare(originFile.children, newFile.children)
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
                    showFsList2.splice(originIndex, 0, {
                        name: originFile.name,
                        tag: 'less',
                        open: true,
                        newIndex: this._globalIndex++,
                        originIndex: originFile.originIndex,
                        children: [],
                        base: originFile.base
                    })
                    this.fsListShowCompare(originFile.children, showFsList2[originIndex].children, 'more')
                } else {
                    showFsList2.splice(originIndex, 0, {
                        name: originFile.name,
                        tag: 'less',
                        base: originFile.base
                    })
                }
            }
        })
    
        showFsList2.forEach((newFile, newIndex) => {
    
            // 如果上级目录已经不同，就不用再比下级了
            if (tag == 'less') {
                newFile.tag = 'more'
                if (newFile.children) {
                    showFsList1.push({
                        name: newFile.name,
                        tag: 'less',
                        open: true,
                        originIndex: this._globalIndex++,
                        newIndex: newFile.newInfex,
                        children: [],
                        base: newFile.base
                    })
                    this.fsListShowCompare(showFsList1[newIndex].children, newFile.children, 'less')
                } else {
                    // 当右边确定是文件，且坐标文件中不存在时
                    showFsList1.push({
                        name: newFile.name,
                        tag: 'less',
                        base: newFile.base
                    })
                }
                return
            }
    
    
            let searchInOriginFolder = showFsList1.some((originFile) => {
                if (originFile.name == newFile.name) {
                    // 名字相同，比较是否均为文件或者均为文件夹
                    if (originFile.children && newFile.children) {
                        originFile.newIndex = newFile.newIndex
                        this.fsListShowCompare(originFile.children, newFile.children)
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
                    showFsList1.splice(newIndex, 0, {
                        name: newFile.name,
                        tag: 'less',
                        open: true,
                        originIndex: this._globalIndex++,
                        newIndex: newFile.newInfex,
                        children: [],
                        base: newFile.base
                    })
                    if (newFile.children.length > 0) {
                        this.fsListShowCompare(showFsList1[newIndex].children, newFile.children, 'less')
                    }
                } else {
                    // 当文件比较，右边存在且左边不存在时  
                    showFsList1.splice(newIndex, 0, {
                        name: newFile.name,
                        tag: 'less',
                        base: newFile.base
                    })
                }
            }
        })
    }
    

}

// let fc = new FilesCompare(`D:\\Projects\\test\\nw-demo\\src\\samples\\upload-same-add-f-file`, `D:\\Projects\\test\\nw-demo\\src\\samples\\upload-same-add-p-file`)

// let fc = new FilesCompare(`D:\\Projects\\test\\nw-demo\\src\\samples\\upload-same-add-e-file`, `D:\\Projects\\test\\nw-demo\\src\\samples\\upload-same-add-f-file`)
// fc.dictCompare()


// v1.1.0 2019-4-9
// 改用变动的class来进行页面功能的封装，功能完成，但是有切换文件夹时无法总是同步更改信息的bug

// let compareFolder = document.querySelector('#originFolderText'),
let comparedBtn = document.querySelector('#originFolderSelector'),
comparedList = document.querySelector('#originFileList'),
// comparedFolder = document.querySelector('#newFolderText'),
compareBtn = document.querySelector('#newFolderSelector'),
compareList = document.querySelector('#newFileList'),
resultPage = document.querySelector('.result'),
resultList = document.querySelector('.resultList');

let fc = new FilesCompare()

// 选择文件目录
comparedBtn.addEventListener('change', (e) => {
    if(fc.path1) {
        fc.resetFiles()
    }
    fc.path1 = e.target.files[0].path
    document.querySelector('.comparedPath').value = fc.path1
    if(!fc.path2) {
        fc.getFileList1()
        comparedList.innerHTML = renderList(fc._fsListShow1, 'file')
    } else {
        compare()
    }
})

compareBtn.addEventListener('change', (e) => {
    if(fc.path2) {
        fc.resetFiles()
    }
    fc.path2 = e.target.files[0].path
    document.querySelector('.comparePath').value = fc.path2
    if(!fc.path1) {
        fc.getFileList2()
        compareList.innerHTML = renderList(fc._fsListShow2, 'file')
    } else {
        compare()
    }
})

document.querySelector('.wrapper').addEventListener('click', function (e) {
    // 点击开关切换状态
    if (!/switch/.test(e.target.className)) {
        return
    }
    let data = e.target.dataset
    if (e.pageX / window.innerWidth < 0.5) {
        if (data.originindex && data.originindex != '-1') {
            fc.switchOpenStatus(data.originindex, true)
        } else if (data.newindex && data.newindex != '-1') {
            fc.switchOpenStatus(data.newindex, false)
        }
    } else if (e.pageX / window.innerWidth > 0.5) {
        if (data.newindex && data.newindex != '-1') {
            fc.switchOpenStatus(data.newindex, false)
        } else if (data.originindex && data.originindex != '-1') {
            fc.switchOpenStatus(data.originindex, true)
        }
    }
    comparedList.innerHTML = renderList(fc._fsListShow1, 'file')
    compareList.innerHTML = renderList(fc._fsListShow2)

})

// 左右同步滚动
let x = 0
document.querySelector('.wrapper').addEventListener('mousemove', (e) => {
    x = e.pageX
})
// 滚动事件的联动，判断鼠标位置，防止滚动事件造成的相互影响
comparedList.addEventListener('scroll', function (e) {
    if(x / window.innerWidth < 0.5) {
        compareList.scrollTop = e.target.scrollTop
    }
})

compareList.addEventListener('scroll', function (e) {
    if(x / window.innerWidth > 0.5) {
        comparedList.scrollTop = e.target.scrollTop
    }
})

document.querySelector('#showResult').addEventListener('click', () => {
    if(localStorage.auto) {
        resultList.innerHTML = JSON.parse(localStorage.auto).map(item => `<li>${item}</li>`).reduce((a,b) => a+b)
    }
    resultPage.style.display = 'block'
})
document.querySelector('#hideResult').addEventListener('click', () => {
    resultList.innerHTML = ''
    resultPage.style.display = 'none'
})

// 当两侧文件列表均具备时，比对的方法
function compare() {
    fc.dictCompare(() => {
        fc.fsListShowCompare(fc._fsListShow2, fc._fsListShow1)
        comparedList.innerHTML = renderList(fc._fsListShow1, 'file')
        compareList.innerHTML = renderList(fc._fsListShow2)
        localStorage.auto = JSON.stringify(fc.diffFileList.map(item => item.replace(/\\/g, '/')))
    })
}

// 生成列表和空格的方法
function renderList(list, mode, n) {
    let str = '', base = ''
    if (!n) {
        n = 0
    }
    if (!mode) {
        mode = 'compare'
    }
    list.forEach((item) => {
        if(!item.base) {
            console.log(item)
            // debugger
        }
     
        if(fc._fsListShow1.length > 0 && item.base.indexOf(fc.fileList1.base) >= 0) {
            base = fc._fsListShow1[0].base
        } else {
            base = fc._fsListShow2[0].base
        }
        if (item.children) {
            str += `<li class='folder-list-container'>
                <p class="folder 
                    ${ (item.tag == 'less' && mode == 'file') 
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
                    ${(fc && fc.fileList2.length > 0 && (fc.diffFileList.includes(item.base.replace(base, '') + '\\' + item.name) && !fc._fileMoreList.includes(fc.fileList2.base + item.base.replace(base, '') + '\\' + item.name)) )? 'diff' : (item.tag == 'less' && mode == 'file') 
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

// v0.0.0，2019-4-1
// 选择两个文件夹，比较出文件夹目录的差异，并在页面中显示，显示效果支持左右比对和文件夹的开关

/*

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
let moreFileList = [], fc


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
            fc = new FilesCompare(originFolderSelector.files[0].path, newFolderSelector.files[0].path)
            fc.dictCompare(() => {
                results = fileListCompare(origins[0].children, news[0].children)
                recordFileList()
                originFileList.innerHTML = renderList(origins, 'file')
                newFileList.innerHTML = renderList(news)
            })
        }
    }
}

function recordFileList() {
    formatMoreFileList()
    localStorage.auto = JSON.stringify(moreFileList)
}

function formatMoreFileList() {
    moreFileList = [... new Set( moreFileList.map((item) => {
        return item.split(path.sep).join('/')
    })
    )] 

}


function renderList(list, mode, n) {
    let str = '', base = ''
    if (!n) {
        n = 0
    }
    if (!mode) {
        mode = 'compare'
    }
    list.forEach((item) => {
        if(item.base.indexOf(origins[0].base) >= 0) {
            base = origins[0].base
        } else {
            base = news[0].base
        }
        if (item.children) {
            str += `<li class='folder-list-container'>
                <p class="folder 
                    ${ (item.tag == 'less' && mode == 'file') 
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
                    ${(fc && (fc.diffFileList.includes(item.base.replace(base, '') + '\\' + item.name)) )? 'diff' : (item.tag == 'less' && mode == 'file') 
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

    // 转换数据结构
    function formatFsList(files) {
        files = files.map((file) => {
            if (typeof file == 'string') {
                return {
                    name: file,
                    base: files.base
                }
            } else if (file instanceof Object) {
            
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
                files.base = absPath
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
                // moreFileList.push(newFile.base)
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
                // moreFileList.push(newFile.base)
                originFolder.splice(newIndex, 0, {
                    name: newFile.name,
                    tag: 'less'
                })
            }
        }
    })
}

*/