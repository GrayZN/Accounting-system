# Accounting-system

简单的记账簿网页应用

## 主体目录

* Interface 前端部分(BootStrap,jQuery)
* Server 后端部分(Express框架)
* Data 用于存放数据(.json)

## 使用方法

* 下载文件
* 在Server目录下
    *       npm install 安装依赖
    *       npm start 运行后端程序(运行于3000端口)
* 在Interface目录下
    * 将index.html放置于8080端口的静态服务器上
        * 后端进行限制,只有8080端口可用访问
        * 可用使用 node 的 http-server 模块运行
* 在浏览器中访问8080端口即可运行 记账簿 应用

## 项目描述

该项目是大二下学期的一个课程设计,当时只熟悉前端页面的制作,对于后端还比较陌生,所以只是借用了node的fs模块来补足js无法直接操作磁盘文件的特点来达到不引入数据库存取数据的目的

&emsp;&emsp;后台采用的express快速搭建,只有两个API,即读取文件及存储文件,其余的数据操作都交由前台完成.数据存储在内存中,用户修改后即存即读即刷新,采用这种看似很不符合规范的方式也是当时技术能力有限的无奈之举

&emsp;&emsp;前台则是采用了adminLTE页面框架和一些插件组合而成,采用了load加载的单页面应用


## 技术栈

| 语言 | JS框架 | CSS框架 | 后台框架 | 页面框架 | 表插件 |
|-|-|-|-|-|-|-|
|HTML,CSS,JS(Node)|jQuery|BootStrap|Express | adminLTE | heightchart \|



