

### 命令行Cli工具安装

1. 全局安装simple-coder

   $npm install -g simple-coder

### 从零开始生成项目：
1. 工作目录用 simple-coder create【项目名称】创建项目

   $simple-coder create demo
   
2. 在命令提示行选择项目类型，录入项目基本配置信息信息
3. 进入项目开始使用     
   $cd 【项目名称】
### 手动对模板项目进行配置
1. 手动到git库中下载项目模板
2. 进入到模板库目录中
3. 对项目进行可用化配置（根据提示录入项目配置信息）

   $simple-coder config 

### 快速智能生成项目模块
1. 创建Java Service模块
-  进入Service项目源码目录或API-RPC项目目录

-  在服务代码的Model定义目录（om/simple/bz/model）下创建一个模块的Model类（暂支持JPA ORM)

```
package com.simple.bz.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="tbl_demo")
public class DemoModel implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    //名称
    private String name;
    //说明
    private String description;
}
```
  
-  用simple-coder create-java-module/service-module [基本包名][Model名] [类名]自动解析Model定义并创建对应的 DAO,DTO,SERVICE,CONTROLLER(如果加上Model名这个参数，则只会生成或更新此Model对应的 DAO,DTO,SERVICE,CONTROLLER)

   $simple-coder create-java-module com.simple.bz Demo (如果不指定Demo缺省会把com/simple/bz/model目录下的所有model对应的dao,dto,service,controller都会重新创建。)
-  指定创建某一类型类（比如dto,service,dao,controller等）
   $simple-coder create-java-module com.simple.bz Demo dto(这条命令只会根据指定的Demo Model生成对应的dto)
       
 
2. 创建小程序模块

-  simple-coder create-mini-module/mini-module [Module名] [类名]
-  用simple-coder create-mini-module/mini-module [Module名] [类名] 当前小程序上创建对应模块的，Model,Page,Route等
   $simple-coder create-mini-module Demo 
-  指定创建某一类型类（比如model,page,route等）
   $simple-coder create-mini-module Demo model (这条命令只会在Demo模块下创建 model类)

3. 创建后台管理站点模块

-  simple-coder create-admin-module/admin-module [Module名] [类名]
-  创建当前后台站对应模块的Model,Page,Route等
   $simple-coder create-admin-module Demo 
-  指定创建某一类型类（比如model,page,route等）
   $simple-coder create-admin-module Demo model (这条命令只会在Demo模块下创建model类,不会创建或更新page,route等)   

4. 创建后台管理站点模块

-  simple-coder create-web-module/web-module [Module名] [类名]
-  创建Web Online站点对应模块的Model,Page,Route等
   $simple-coder create-web-module Demo 
-  指定创建某一类型类（比如model,page,route等）
   $simple-coder create-web-module Demo model (这条命令只会在Demo模块下创建model类,不会创建或更新page,route等)     

### 组件供第三方应用使用：
1. 应用安装
   
   $npm install simple-coder

2. 在node.js第三方应用环境下使用

```
    const simpleCoder = require('simple-coder');

    const supportApplications = simpleCoder.getSupportApplications();

    console.log('support application list->', supportApplications);

    const configData = {
      templateName:'server:spring-boot',
      name:'test-server',
      appId: '100001',
    }
    simpleCoder.createProject(configData);
```
### 目前支持的项目类型
  1. 项目类型：

  |类型名称        |类型标识               |描述                         |备注                    | 
  |---------------|:-------------------:|:----------------------------|:----------------------| 
  |Java服务|server:spring-boot|基于Spring-boot框架的Java服务|依赖于simple-lib公共库|
  |小程序|mini-program:taro|基于Taro框架的小程序|依赖于simple-framework-mini组件库提供组件及基础功能|
  |后台管理网站|web-admin:antd-pro|基于Ant Design Pro框架的后台管理|依赖于simple-framework组件库提供公共组件|
  |网站|web:antd-pro|基于Ant Design Pro框架的网站|依赖于simple-framework组件库提供公共组件|
  |Next网站|web:nextjs|基于Next.js框架的网站|依赖于simple-framework组件库提供公共组件|
  |简单React网站|web:reactjs|基于React.js简单网站|依赖于simple-framework组件库提供公共组件，方便自由定制，提供常用支持（基础IO,Redux,Sentry异常，日志，UBT等）|




### FAQ

