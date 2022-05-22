

### 环境配置
1. 安装node，npm版本3以上。

2. 全局安装simple-coder

   $npm install -g simple-coder

### 从零开始生成项目：
1. 工作目录执行创建
   simple-coder create【项目名称】
2. 在命令提示行选择项目类型，录入项目基本配置信息信息
3. 进入项目开始使用     
   $cd 【项目名称】
### 手动对模板项目进行配置
1. 手动到git库中下载项目模板
2. 进入到模板库目录中
3. 对横目进行可用化配置（根据提示录入项目配置信息

   $simple-coder config 

### 快速智能生成项目模块
1. 创建Java Service模块
-  进入Service项目源码目录或API-RPC项目目录

-  在服务代码的Model定义目录（om/simple/bz/model）下创建一个模块的Model类（暂支持JPA ORM)
  
-  用simple-coder根据此目录下的所有Model类自动创建对应的 DAO,DTO,SERVICE,CONTROLLER(如果加上Model名这个参数，则只会生成或更新此Model对应的 DAO,DTO,SERVICE,CONTROLLER)

   $simple-coder create-java-module [Model名]
   
 
2. 创建小程序模块

### 组件供第三方应用使用：
1. 应用安装
   
   $npm install simple-coder
   
2. 在node.js第三方应用环境下使用

  const simpleCoder = require('simple-coder');

  const supportApplications = simpleCoder.getSupportApplications();
  console.log('support application list->', supportApplications);

  const configData = {
     templateName:'server:spring-boot',
     name:'test-server',
     appId: '100001',
  }
  simpleCoder.createProject(configData);

### FAQ

