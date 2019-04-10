
class CompareManager {
    constructor(options = {
        autoFileList: [],
        handFileList: []
    }) {
        this.autoFileList = options.autoFileList
        this.handFileList = options.handFileList

       
    }

    // 将比对的绝对路径格式化为相对路径
    formatFileList(altList, promptWord) {
        // let absPath = prompt(promptWord)
        // // 点击取消，空的确定是 ""
        // if(absPath === null) {
        //     return false
        // }
     
        // if(altList == 'auto') {
        //     this.autoFileList = this.autoFileList.map((item) => {
        //         return item.replace(absPath, '')
        //     })
        // } else if(altList == 'hand') {
        //     this.handFileList = this.handFileList.map((item) => {
        //         return item.replace(absPath, '')
        //     })
        // }
    }

    compare() {

        let autoMoreThanHand = this.autoFileList.filter(val => !this.handFileList.includes(val))
        let handMoreThanAuto = this.handFileList.filter(val => !this.autoFileList.includes(val))
        let autoAndHand = this.autoFileList.filter(val => this.handFileList.includes(val))

        this.autoFileList = [...new Set(autoAndHand.concat(autoMoreThanHand.map((item) => {
            return {
                file: item,
                exist: true
            }
        })).concat(handMoreThanAuto.map((item) => {
            return {
                file: item,
                exist: false
            }
        })))].sort((a, b) => {
            let _a = typeof a == 'string' ? a : a.file
            let _b = typeof b == 'string' ? b : b.file
            return _a > _b
        })

        this.handFileList = [...new Set(autoAndHand.concat(autoMoreThanHand.map((item) => {
            return {
                file: item,
                exist: false
            }
        })).concat(handMoreThanAuto.map((item) => {
            return {
                file: item,
                exist: true
            }
        })))].sort((a, b) => {
            let _a = typeof a == 'string' ? a : a.file
            let _b = typeof b == 'string' ? b : b.file
            return _a > _b
        })
    }

    getFileStr(list) {
        return list.reduce((a, b) => {
            return a + '\n' + b 
        })
    }
    
    getFileHtmlStr(list) {
        return '<li>' + list.reduce((a, b) => {
            return  a + '</li><li>' + b
        }) + '</li>'
    }

    getFileCompareStr(list) {
        let str = ''
        list.forEach((item) => {
            if(typeof item == 'string') {
                str += '<li>' + item + '</li>'
            } else if(typeof item == 'object') {
                str += '<li style="color:' + (item.exist ? '#00ee00' : 'red') + ';">' + item.file + '</li>'
            }
        })
        return str
    }
}

function init() {
    if(!localStorage.auto) {
        return
    }
    if(!localStorage.hand) {
        return
    }
    // let str = prompt('请输入本地自动测试差异文件需要去除的绝对路径：')
    // console.log(str)
    cm = new CompareManager({
        autoFileList: JSON.parse(localStorage.auto),
        handFileList: JSON.parse(localStorage.hand)
    })
  
    document.querySelector('#autoList').innerHTML = cm.getFileHtmlStr(cm.autoFileList)
    document.querySelector('#handList').innerHTML = cm.getFileHtmlStr(cm.handFileList)
    handle(cm)
}

function handle(cm) {
    // document.getElementById('delAutoPath').addEventListener('click', () => {
        let status = cm.formatFileList('auto')
        if(status === false ) {
            return
        }
        document.querySelector('#autoList').innerHTML = cm.getFileHtmlStr(cm.autoFileList)
        cm.compare()
        document.querySelector('#autoList').innerHTML = cm.getFileCompareStr(cm.autoFileList)
        document.querySelector('#handList').innerHTML = cm.getFileCompareStr(cm.handFileList)
    // })

    // 同步滚动
    let x = 0
    document.querySelector('.wrapper').addEventListener('mousemove', (e) => {
        x = e.pageX
    })
    document.querySelector('#autoList').addEventListener('scroll', function (e) {
        if(x / window.innerWidth < 0.5) {
            document.querySelector('#handList').scrollLeft = e.target.scrollLeft
        }
    })
    document.querySelector('#handList').addEventListener('scroll', function (e) {
        if(x / window.innerWidth > 0.5) {
            document.querySelector('#autoList').scrollLeft = e.target.scrollLeft
        }
    })
}
let cm
window.onload = init

