
const fs = require('fs')

class FileListManager {
    // 更新表格需要手动设置，每次修改fileList调用renderTabel

    constructor(options = {
        fileList: []
    }) {
        this.name = options.name
        this.tbodyEl = options.tbody 
        this.fileList = options.fileList || []
        this.initTable = true

        this.ADD_LIST_BTN = 'AddListBtn'
        this.ADD_LIST_FIELD = 'AddListField'
        this.ADD_LIST_CONFIRM = 'AddListConfirm'
        this.ADD_LIST_CANCLE = 'AddListCancle'
    }

    recordList() {
        localStorage.hand = JSON.stringify(this.fileList)
    }

    showStorageList() {
        if(localStorage.hand) {
            this.fileList = JSON.parse(localStorage.hand)
            this.renderTable()
        }
    }
    
    // 页面中填充表格内容
    renderTable() {
        document.querySelector(this.tbodyEl).innerHTML = this.getFileListStr()
        this.tableHandler()
        if(this.initTable) {
            this.initTable = false
        }
        this.recordList()
    }
    tableHandler() {
        let self = this
        // 新增列表按钮
        function addBtnHandle() {
            self.showAddPanel()
        }
        // 删除按钮
        function delBtnHandle(e) {
          
            if(e.target.classList.value.includes('delete-code-item')) {
                let index = parseInt(e.target.dataset.index)
                if(index >= 0) {
                    self.fileList.splice(index, 1)
                    self.renderTable()
                }
            }
        }

        if(this.initTable) {
            document.querySelector(this.tbodyEl).addEventListener('click', delBtnHandle)
        } else {
            document.querySelector('#' + this.name + this.ADD_LIST_BTN).addEventListener('click', addBtnHandle)
        }
        document.querySelector('#' + this.name + this.ADD_LIST_BTN).addEventListener('click', addBtnHandle)

    }

    // 将列表数据转换成字符串
    getFileListStr() {
        let str = `<tr><td colspan=3><input id=${this.name + this.ADD_LIST_BTN} type="button" value="增加列表" /></td></tr>`
        this.fileList.forEach((item, index) => {
            str += `
                <tr>
                    <td>${index}</td>
                    <td>${item}</td>
                    <td><input data-index=${index} class="delete-code-item" type="button" value="删除"></td>
                </tr>
            `
        })
        return str
    }

    // 生成添加列表的窗口
    showAddPanel() {
        // 创建添加的对话框
        let div = document.createElement('div');
        let styles = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'felx',
            justifyContent: 'center',
            alignItems: 'center'
        }
        for(let key in styles) {
            div.style[key] = styles[key]
        }
        div.innerHTML = `
            <div>
                <textarea style="width: 800px;height: 500px;" class=${this.name + this.ADD_LIST_FIELD}></textarea>
                <div>
                    <input class=${this.name + this.ADD_LIST_CONFIRM} type="button" value="确定">
                    <input class=${this.name + this.ADD_LIST_CANCLE} type="button" value="取消">
                </div> 
            </div>
        `
        document.body.appendChild(div)
        this.addPanelHandler(div)
    }
    // 添加窗口的事件监听
    addPanelHandler(dom) {
        let self = this
        // 确认添加文件列表
        function confirmHandle() {
            let newList = document.querySelector('.' + self.name + self.ADD_LIST_FIELD).value
            cancleHandle()
            self.setFileList(self.fileList.concat([newList]))
            self.renderTable()
        }
        // 取消添加
        function cancleHandle() {
            // 取消事件监听
            document.querySelector('.' + self.name + self.ADD_LIST_CONFIRM).removeEventListener('click', confirmHandle)
            document.querySelector('.' + self.name + self.ADD_LIST_CANCLE).removeEventListener('click', cancleHandle)
            document.body.removeChild(dom)
        }

        // 监听事件
        document.querySelector('.' + this.name + this.ADD_LIST_CONFIRM).addEventListener('click', confirmHandle)
        document.querySelector('.' + this.name + this.ADD_LIST_CANCLE).addEventListener('click', cancleHandle)

    }

    // 定义文件列表
    setFileList(fileList) {
        // 首先将excel导出，或者录入字符串的文件列表全部拆分开
        fileList = fileList.map((item) => {
            if(typeof item == 'object' && typeof item.v == 'string') {
                return item.v.trim().split('\n')
            } else if(typeof item == 'string') {
                return item.trim().split('\n')
            } else {
                return item
            }
        })
        // 如果是二维数组，转换为一维数组，过滤空行，然后统一格式并排序
        fileList = fileList.flat(2).filter((item) => {
            if(item == '\n' || item == "") {
                return false
            }
            return true
        }).map((item) => {
            if(/^\/ecpweb\/page/.test(item) || /^\/ecpweb\/config/.test(item)) {
                return item.slice(7)
            }        
            if(/^ecpweb\/page/.test(item) || /^ecpweb\/config/.test(item)) {
                return item.slice(6)
            }
            if(/^page/.test(item) || /^config/.test(item)) {
                return '/' + item
            }
            return item
        }).sort()
        // 去重
        this.fileList = [...new Set(fileList)]
    }

}




let exported = new FileListManager({tbody: '.exported-code-list'})
exported.renderTable()
document.getElementById('upload').addEventListener('change', function(e) {
    let code_list = []
    if(this.files.length < 1) {
        return
    }
    document.querySelector('.uploadPath').value = e.target.files[0].path
    // 解析excel，并将I和J列的文件列表获取
    var buf = fs.readFileSync(this.files[0].path);
    var wb = XLSX.read(buf, {type:'buffer', raw: true});
    // 通过Sheets -> 用例信息表，!ref指定数据的从 A1 到 K+行数，获取行数遍历装载数据
    var ex_list = wb.Sheets[wb.SheetNames[0]]
    var raws = /(?<=A1:K)\d+/.exec(ex_list['!ref'])[0]
    for(let i = 2; i <= raws; i++) {
        code_list.push(ex_list['I' + i])
        code_list.push(ex_list['J' + i])
    }
    

    exported.setFileList(code_list)
    exported.renderTable()

        
})







