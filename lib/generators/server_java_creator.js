
var path = require('path');
var fs   = require('fs');
var codeTools = require('../code_tools');
var xtools = require('../xtools');

var config = {
    javaInit: false,
    appName : "",
    module: "",
    sideName:"server",
    workRootPath: process.cwd(),
    targetRootPath:process.cwd(),
    language : "java",
    basePackage:"com.simple.server.bz",

    //当前工作目录下的模块定义目录
    workModulesPath: function(){return path.join(this.workRootPath , "modules/")},


    targetServerRootPath:function(){return path.join(this.targetRootPath,"/")},

    targetServerCodePath:function(){return path.join(this.targetServerRootPath(),"/src/main/java/",xtools.javaPackageToPath(this.basePackage))},

    //当前工作目录下的模板目录
    workTemplateRootPath:  function(){return path.join(this.workRootPath,"node_modules/simple-coder/templates/");},
    templatePath: function(){return this.workTemplateRootPath()  + this.sideName + "/" + this.language + "/";},
    workServerTemplatePath:function(){return path.join(this.templatePath(),"module/")},
    workCopyFilesTemplatePath:function() {return path.join(this.templatePath() , "copyfiles/")},
    workReleasePackageTemplatePath:function() {return path.join(this.templatePath() , this.sideName,"release/");},
    //web path define


    //打包工具代码目录
    targetReleasePackagePath:function(){return path.join(this.targetServerRootPath(),  "/release/");},

    buildBaseParams: function(){
        return {
            appName: this.appName,
            moduleName:this.module,
        };
    }
};


function createConfigRouter(moduleName,moduleDefine){
    var filename =  "router.js";
    var tFilename = filename;
    templateFile = config.workRouterTemplatePath() + tFilename ;
    moduleFile   = config.targetModuleRouterPath() + filename;
    var params = config.buildBaseParams();
    codeTools.generateCode(templateFile,params,moduleFile);

};

function createReleasePackageFiles(){

    var filename =  "webpack.config.js";
    tFilename = filename;
    var releaseFilename = config.platform + "." +config.endName + "." +filename;
    var templateFile = config.workReleasePackageTemplatePath() + tFilename ;
    var moduleFile   =  config.targetReleasePackagePath() + releaseFilename;
    var params = config.buildBaseParams();
    codeTools.generateCode(templateFile,params,moduleFile);

};



function createServerBZModules(moduleName,moduleDefine){

    var mName = codeTools.firstUpper(moduleName);
    var params = config.buildBaseParams();
    params.moduleDefine = moduleDefine;
    params.moduleName = mName;
    params.clsName = mName;
    params.originModuleName = moduleName;
    params.packageName = config.basePackage;
    params.firstUpper = codeTools.firstUpper;
    //codeTools.generateCode(templateFile,params,targetFile);


    var templateFile = config.workServerTemplatePath() + "Entity.java" ;
    var targetFile   = config.targetServerCodePath() + "entity/" + mName + ".java";
    codeTools.generateCode(templateFile,params,targetFile);

    templateFile = config.workServerTemplatePath() + "Dao.java" ;
    //var clsName = nName + "Repository";
    targetFile   = config.targetServerCodePath() + "dao/" + mName+"Repository.java";
    codeTools.generateCode(templateFile,params,targetFile);

    templateFile = config.workServerTemplatePath() + "Service.java" ;
    targetFile   = config.targetServerCodePath() + "service/" + mName + "Service.java";
    codeTools.generateCode(templateFile,params,targetFile);


    templateFile = config.workServerTemplatePath() + "Controller.java" ;
    targetFile   = config.targetServerCodePath() + "controller/" + mName + "Controller.java";
    codeTools.generateCode(templateFile,params,targetFile);
};

function generateFrameworkDirectories(){
    if (!config.javaInit) {

        xtools.mkdirX(config.targetServerRootPath());

        xtools.mkdirX(config.targetServerCodePath());
        //xtools.mkdirX(config.targetReleasePackagePath());
    }
    console.log("targetServerRootPath:" + config.targetServerRootPath());
    xtools.mkdirX(config.targetServerCodePath()+ 'entity');
    xtools.mkdirX(config.targetServerCodePath()+ 'controller');
    xtools.mkdirX(config.targetServerCodePath()+ 'service');
    xtools.mkdirX(config.targetServerCodePath()+ 'dao');
}
function createModuleBaseDirectories(moduleName){

}
function copyProjectFrameworkFiles(){

}
function copyFrameworkFiles(){
    var frameworkServerPath = path.join(config.workCopyFilesTemplatePath(), "/server/simpleserver/");
    xtools.copyDirEx(frameworkServerPath,config.targetServerRootPath());
}


function copyReleaseFrameworkFiles(){
   //var frameworkReleasePath = config.workCopyFilesTemplatePath() + "/release/";
   // xtools.copyDirEx(frameworkReleasePath,config.targetReleasePackagePath());
}
function initPathEnv(defines){
    var currentPath = process.cwd();
    var serverRoot = "";
    if (currentPath.indexOf('autocoder')>-1){
        serverRoot = path.resolve(process.cwd(), '../');
        config.javaInit = true;
    }else{
        serverRoot = path.join(process.cwd(), "server/java/simpleserver/");
        config.javaInit = false;
    }

    config.workRootPath = currentPath;
    config.targetRootPath = serverRoot;
    config.basePackage = defines.basePackage;
    config.apiServer = defines.apiServer;
    console.log("workRootPath:" + config.workRootPath + "Code-targetServerPath:" + config.targetRootPath);


}

function generateFramework(defines,sideName){
    initPathEnv(defines);
    generateFrameworkDirectories();
    if (!config.javaInit){
        copyFrameworkFiles();
        copyReleaseFrameworkFiles();
    }

}

function generateServerAPIModule(moduleName,moduleDefine){
    config.module = moduleName;
    createModuleBaseDirectories(moduleName);
    createServerBZModules(moduleName,moduleDefine);
}

function generateModuleByName(moduleName,defines,param){
    //initPathEnv(defines);
    var mdefine = defines[moduleName];
    if (!mdefine){return;}
    console.log('module defines:' + JSON.stringify(mdefine));
    generateServerAPIModule(mdefine.name,mdefine.fields);
}
exports.generateFramework = generateFramework;
exports.generateModuleByName = generateModuleByName;
exports.initEnv = initPathEnv;

exports.coderDefine = {name:"server-java",desc:"create a server based java and related project code"};


