var path = require('path');
var fs = require('fs');
var codeTools = require('./code-tools');
var store = require('./json_db');

var generatorList = [];
var moduleDefines = {basePackage:"com.simple.bz",enables: [], modules: {}};

var config = {
    //rootPath:  process.cwd(),
    workRootPath: process.cwd(),
    workModulesPath: function () {return path.join(this.workRootPath, "modules/")},
    rootGeneratorsPath: function () {return path.join(this.workRootPath,"node_modules/simple-coder/lib/generators/");},
};

function loadModulesDefinesByFiles() {

    var mPath = config.workModulesPath();
    var files = fs.readdirSync(mPath);
    files.forEach(function (file) {
        var filePath = mPath + file;
        var stats = fs.statSync(filePath);
        if (!stats.isDirectory()) {
            var mdefine = require(filePath);
            if (!mdefine.name) {
                return;
            }
            console.log(filePath);
            var moduleName = mdefine.name;
            moduleDefines.modules[moduleName] = mdefine;
        }
    });

    var setting = require(mPath + "config");
    moduleDefines.enables = setting.enables;
    moduleDefines.basePackage = setting.basePackage;
    moduleDefines.apiServer = setting.apiServer;
}


function findGeneratorByName(name) {
    var foundGenerator;
    generatorList.forEach(function (generator) {
        if (generator.coderDefine.name == name) {
            foundGenerator = generator;
            return;
        }
    });

    return foundGenerator;
}
function generatorPromptMsg(name) {
    var msg = 'Usage:\n';
    generatorList.forEach(function (generator) {
        var cmd = generator.coderDefine.name;
        var desc = generator.coderDefine.name;
        msg = msg + "Command:[" + cmd + "] --Function:" + desc + "\n";
    });

    return msg;
}

function loadGenerators() {
    var mPath = config.rootGeneratorsPath();
    var files = fs.readdirSync(mPath);
    files.forEach(function (file) {
        var filePath = path.join(mPath, file);
        console.log("generater file:" + filePath);
        var stats = fs.statSync(filePath);
        if (!stats.isDirectory()) {
            var generator = require(filePath);
            if (!generator.coderDefine) {
                return;
            }
            if (!generator.coderDefine.name) {
                return;
            }
            generatorList.push(generator);
        }
    });
}
function initGenerators() {
    initPathEnv();
    loadGenerators();
    loadModulesDefinesByFiles();

}
function initPathEnv(projectName) {
    var currentPath = process.cwd() + "/";

    console.log("currentPath is:" + currentPath);
    config.workRootPath = currentPath;
}

function initProject(projectName) {
    initGenerators();
    generateCode("js","init");
    generateCode("js-framework","init");
    generateCode("rj","init");
    generateCode("server-java","init");
    console.log("finished init project !");
}
function generateCode(cmdOption, config, verbose) {

    initGenerators();

    var generator = findGeneratorByName(cmdOption,config);
    if (!generator) {
        console.log("Generator named:[" + cmdOption + "] not found!");
        return;
    }

    var actionInit = false;
    var sideName = config;
    if((config=='init')){sideName = 'default';actionInit=true}
    if(!config){sideName = 'default'}
    if ((sideName != 'client')&&(sideName != 'admin')&&(sideName != 'web')&&(sideName!='all')&&(sideName!='default')){
        return;
    }

    generator.initEnv(moduleDefines);

    if(actionInit){
        generator.generateFramework(moduleDefines,sideName);
    }

    moduleDefines.enables.forEach(function (moduleName) {
        generator.generateModuleByName(moduleName, moduleDefines.modules,sideName);
    });
    console.log("generated code by define file in modules directory\n");

}

exports.generateCode = generateCode;
exports.generatorPromptMsg = generatorPromptMsg;
exports.initProject = initProject;





