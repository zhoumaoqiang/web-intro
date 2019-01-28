# an
# 依赖管理

1. 从nodeJS官网下载稳定版node程序，安装完成后，打开命令行工具，输入```node -v```和```npm -v```查看节点安装情况，可以使用```npm install npm@latest -g```将npm更新至最新版本
2. 使用```npm install <package>``` 获取依赖


# 错误
- 首先设置```npm config set prefix ...``` 和 ```npm config set cache ...```，条件环境变量"PATH_MODULE"，在全局环境下仍不能使用npm指令
- 设置```npm i npm -g```，可以使用npm指令，但是使用时报```path argument must be a string, but got null```
- 再次调整npm config，出现错误```TypeError: Path must be a string. Received undefined```
- 原config无法修改，卸载nodeJS，删除安装的文件夹，再重新安装稳定版的nodeJS，全部选择默认选项，删除C盘中的```.npmrc```文件，以清除原来的npm config，再使用npm就能够正常运行了