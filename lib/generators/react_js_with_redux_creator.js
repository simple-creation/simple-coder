
var path = require('path');
var fs   = require('fs');
var codeTools = require('../code_tools');
var xtools = require('../xtools');


var config = {
    appName : "",
    module: "",
    platform:"pc",
    endName:"client",
    sideName:"frontend",
    workRootPath: process.cwd(),
    targetRootPath:process.cwd(),
    language : "reactjs",
    framework:"simple",
    basePackage:"com.simple.base.bz",
    apiServer:"",

    //当前工作目录下的模块定义目录
    workModulesPath: function(){return path.join(this.workRootPath , "modules/")},
    //当前工作目录下的模板目录
    workTemplateRootPath:  function(){return path.join(this.workRootPath,"node_modules/simple-coder/templates/");},
    templatePath: function(){return this.workTemplateRootPath()  + this.sideName + "/" + this.language + "/";},
    workCopyFilesTemplatePath:function() {return this.templatePath() +  "copyfiles/"},
    workReleasePackageTemplatePath:function() {return path.join(this.templatePath() ,"release/");},

    targetWebRootPath:function(){return path.join(this.targetRootPath, "/",this.language,"Redux/")},


    workConfigTemplatePath:function(){return this.templatePath() + "config/"},
    workRouterTemplatePath:function(){return path.join(this.templatePath() , "router/");},
    workViewTemplatePath:function(){return path.join(this.templatePath() ,"view/",this.endName,"/");},
    workControllerTemplatePath:function(){return path.join(this.templatePath() ,"controller",this.endName, "/");},
    workModelTemplatePath:function(){return this.templatePath() + "model/"},
    workReduxTemplatePath:function(){return path.join(this.templatePath() , "redux/");},
    workLayoutTemplatePath:function(){return this.templatePath() + "layout/"},

    //代码生成目标目录---网站基本目录

    targetWebResourceRootPath:function(){return path.join(this.targetWebRootPath(), "resources/",this.endName);},
    targetWebResourceFrameworkPath:function(){return path.join(this.targetWebRootPath(), "resources/" , "framework");},
    //打包工具代码目录
    targetReleasePackagePath:function(){return path.join(this.targetWebRootPath(),  "/release/");},
    //测试website 服务器目录
    targetDevelopServerPath:function(){return path.join(this.targetWebRootPath(),  "/dev-server/");},

    targetWebResourceCommonPath:function(){return path.join(this.targetWebResourceRootPath(), "common/");},
    //代码生成目标目录---每个模块目录
    targetModuleRootPath:function(){return path.join(this.targetWebResourceRootPath(),this.module);},
    targetModuleModelPath:function(){return path.join(this.targetWebResourceRootPath(), this.module + "/models/");},
    targetModuleRouterPath:function(){return path.join(this.targetWebResourceRootPath(), this.module + "/");},
    targetModuleConfigPath:function(){return path.join(this.targetWebResourceRootPath(),this.module + "/");},
    targetModuleViewTemplatePath:function(){return path.join(this.targetWebResourceRootPath(), this.module + "/templates/");},
    targetModuleControllerPath:function(){return path.join(this.targetWebResourceRootPath(), this.module + "/");},
    targetModuleComponentsPath:function(){return path.join(this.targetWebResourceRootPath(), this.module + "/components/");},
    targetModuleReduxPath:function(){return path.join(this.targetWebResourceRootPath(), this.module + "/redux/");},

    buildBaseParams: function(){
        return {
            appName: this.appName,
            moduleName:this.module,
            apiServer:this.apiServer,
        };
    }
};


function createLayoutFramework(Defines){

    var filename =  "accordion-menu-outlook.ejs";
    var tFilename = filename;
    var templateFile = config.workLayoutTemplatePath() + tFilename ;
    var moduleFile   = config.targetModuleRouterPath() + filename;
    var params = config.buildBaseParams();
    //params.menus  = Defines.channels;
    codeTools.generateCode(templateFile,params,moduleFile);

};
function createConfigRouter(moduleName,moduleDefine){
    var filename =  "redux-router.js";
    var tFilename = filename;
    var templateFile = config.workRouterTemplatePath() + tFilename ;
    var moduleFile   = config.targetModuleReduxPath()+ filename;
    var params = config.buildBaseParams();
    codeTools.generateCode(templateFile,params,moduleFile);

    filename =  "router.js";
    tFilename = filename;
    templateFile = config.workRouterTemplatePath() + tFilename ;
    moduleFile   = config.targetModuleRouterPath() + filename;
    //var params = config.buildBaseParams();
    codeTools.generateCode(templateFile,params,moduleFile);

};

function createClientReduxItem(itemName){
    var filename =  itemName + ".js";
    var tFilename = filename;
    templateFile = path.join(config.workReduxTemplatePath(),tFilename );
    moduleFile   = path.join(config.targetModuleReduxPath(), filename);
    var params = config.buildBaseParams();
    codeTools.generateCode(templateFile,params,moduleFile);
}


function createClientReduxFlow(){

    //actions
    createClientReduxItem("actions/index");

    //reducers
    createClientReduxItem("reducers/index");
    createClientReduxItem("reducers/homeReducer");
    createClientReduxItem("reducers/listReducer");
    createClientReduxItem("reducers/addReducer");
    createClientReduxItem("reducers/updateReducer");
    createClientReduxItem("reducers/deleteReducer");

};

function createReleasePackageFiles(){

    var filename =  "webpack.config.js";
    tFilename = filename;
    var releaseFilename = config.endName + "." +filename;
    var templateFile = config.workReleasePackageTemplatePath() + tFilename ;
    var moduleFile   =  config.targetReleasePackagePath() + releaseFilename;
    var params = config.buildBaseParams();
    codeTools.generateCode(templateFile,params,moduleFile);

};

function createModel(moduleName,moduleDefine){
    var filename =  "model.js";
    var tFilename = filename;
    var templateFile = config.workModelTemplatePath() + filename;
    var moduleFile   = config.targetModuleModelPath() + tFilename ;
    var params = config.buildBaseParams();
    codeTools.generateCode(templateFile,params,moduleFile);

    filename =  "modelBase.js";
    tFilename = filename;
    var templateFile = config.workModelTemplatePath() + filename;
    var moduleFile   = config.targetModuleModelPath() + tFilename ;
    codeTools.generateCode(templateFile,params,moduleFile);

};
function createFunctionViewAndController(fName, moduleName,moduleDefine){
    var filename =  fName + ".js";
    var tFilename = filename;

    templateFile = config.workControllerTemplatePath() + tFilename ;
    moduleFile   = config.targetModuleControllerPath() + filename;
    var params = config.buildBaseParams();
    params.moduleDefine = moduleDefine;
    codeTools.generateCode(templateFile,params,moduleFile);
};


function createModuleBaseDirectories(moduleName){
    xtools.mkdirX(config.targetWebResourceRootPath());
    codeTools.createDirectory(config.targetModuleRootPath());
    codeTools.createDirectory(config.targetModuleViewTemplatePath());
    codeTools.createDirectory(config.targetModuleControllerPath());
    codeTools.createDirectory(config.targetModuleModelPath());
    codeTools.createDirectory(config.targetModuleRouterPath());
    codeTools.createDirectory(config.targetModuleConfigPath());
    codeTools.createDirectory(config.targetModuleComponentsPath());
    codeTools.createDirectory(config.targetWebResourceCommonPath());
    codeTools.createDirectory(config.targetModuleReduxPath());
    codeTools.createDirectory(path.join(config.targetModuleReduxPath(),'actions/'));
    codeTools.createDirectory(path.join(config.targetModuleReduxPath(),'reducers/'));


}
function generateFrameworkDirectories(){
    console.log("serverRootPath:" + config.targetRootPath + "webRootPath" + config.targetWebRootPath());

    xtools.mkdirX(config.targetWebRootPath());
    xtools.mkdirX(config.targetWebResourceFrameworkPath());
    xtools.mkdirX(path.join(config.targetWebResourceRootPath(), '/common/'));
    xtools.mkdirX(config.targetReleasePackagePath());
}




function generateClientModule(moduleName,moduleDefine){
    config.module = moduleName;
    createModuleBaseDirectories(moduleName);
    createModel(moduleName,moduleDefine);
    createConfigRouter(moduleName,moduleDefine);
    createFunctionViewAndController("add",moduleName,moduleDefine);
    createFunctionViewAndController("edit",moduleName,moduleDefine);
    createFunctionViewAndController("list",moduleName,moduleDefine);
    createFunctionViewAndController("info",moduleName,moduleDefine);
    createFunctionViewAndController("home",moduleName,moduleDefine);
    createFunctionViewAndController("NotFound",moduleName,moduleDefine);
    createFunctionViewAndController("app",moduleName,moduleDefine);

    //redux
    createClientReduxFlow();
}

function initPathEnv(defines){
    var currentPath = process.cwd();
    var serverRoot = "";
    if (currentPath.indexOf('autocoder')>-1){
        //serverRoot = path.resolve(process.cwd(), '../src/main/resources/auto/');
        serverRoot = path.resolve(process.cwd(), './src/');
    }else{
        serverRoot = path.join(process.cwd(), "frontend/");
    }

    config.workRootPath = currentPath;
    config.targetRootPath = serverRoot;
    config.basePackage = defines.basePackage;
    config.apiServer = defines.apiServer;
    config.endName = "client";
    console.log("workRootPath:" + config.workRootPath + "Code-targetServerPath:" + config.targetRootPath);


}


function copyFrameworkFiles(){
    var frameworkThemePath = config.workCopyFilesTemplatePath() + "resources/framework";
    xtools.copyDirEx(frameworkThemePath,config.targetWebResourceFrameworkPath());
}


function copyReleaseFrameworkFiles(){
    var frameworkReleasePath = config.workCopyFilesTemplatePath() + "/withRedux/release/";
    xtools.copyDirEx(frameworkReleasePath,config.targetReleasePackagePath());

    var frameworkThemePath = config.workCopyFilesTemplatePath() + "/dev-server/";
    xtools.copyDirEx(frameworkThemePath,config.targetDevelopServerPath());
}
function generateModuleByName(moduleName,defines,sideName){
    //initPathEnv(defines);
    var mdefine = defines[moduleName];
    if (!mdefine){return;}
    console.log('module defines:' + JSON.stringify(mdefine));

    if (sideName =='all'){
        config.endName='admin';
        generateClientModule(mdefine.name,mdefine.fields);

        config.endName='web';
        generateClientModule(mdefine.name,mdefine.fields);

        config.endName='client';
        generateClientModule(mdefine.name,mdefine.fields);
    }else if(sideName=='default'){
        config.endName= "client";
        generateClientModule(mdefine.name,mdefine.fields);
    }else{
        config.endName= sideName;
        generateClientModule(mdefine.name,mdefine.fields);
    }
}

function generateFramework(defines,param){
    initPathEnv(defines);
    generateFrameworkDirectories();
    copyFrameworkFiles();
    copyReleaseFrameworkFiles();
}
function initProjectEnv(defines){
    initPathEnv(defines);
}

exports.generateFramework = generateFramework;
exports.generateModuleByName = generateModuleByName;
exports.initEnv = initPathEnv;

exports.coderDefine = {name:"rj-with-redux",desc:"create a react js framework and related project code"};


