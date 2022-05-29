#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const projectSetup = require('./lib/setup');
const codeTools = require('./lib/code-tools');
const executeTools = require('./lib/execute-tool');
const createProjectSet = async (configData,workRootPath)=> {
    let result = true;
    if (!configData.name){
        console.log('  *** application name not found!')
        return "";
    }
    const appliationName = configData.name;
    //const templateName   = configData.templateName;

    //const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    const tempPath = path.join(getTempWorkPath(),"/projects");

    if(!workRootPath){
        workRootPath = path.join(tempPath,appliationName);
    }
    if (fs.existsSync(workRootPath)) {
        console.log(chalk.red('  ***WARNING!*** target directory is existed! '));
        let removeFiles = 'rm -rf ' + workRootPath;
        if(!executeTools.executeCommand(removeFiles,'remove old files')){
            return false;
        };
    }
    const loading = ora('processing ...');// 设置loading效果
   
    const appIdStart       = configData.appId;
    let subProjectName     =  '';
    let subProjectWorkPath = '';
    let success = '';
    
    configData.templateName = 'server:spring-boot';
    configData.appId        = appIdStart + 1;
    configData.name         =  subProjectName =  appliationName + '-service';
    subProjectWorkPath     = path.join(workRootPath,subProjectName);
    success = await createProject(configData,subProjectWorkPath);

    configData.templateName = 'mini-program:taro';
    configData.appId        = appIdStart + 2;
    configData.name         =   subProjectName = appliationName + '-mini';
    subProjectWorkPath       = path.join(workRootPath,subProjectName);
    success = await createProject(configData,subProjectWorkPath);

    configData.templateName = 'web-admin:antd-pro';
    configData.appId        = appIdStart + 3;
    configData.name         =   subProjectName = appliationName + '-admin';
    subProjectWorkPath       = path.join(workRootPath,subProjectName);
    success = await createProject(configData,subProjectWorkPath);

    if (!success){
        loading.fail(chalk.red('project creating failure !'));
        return "";
    }
    loading.succeed('project creating success!');
    return workRootPath;
    
}
const createProject = async (configData,workRootPath)=> {
    let result = true;
    if (!configData.name){
        console.log('  *** application name not found!')
        return "";
    }
    const appliationName = configData.name;
    const templateName   = configData.templateName;

    //const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    const tempPath = path.join(getTempWorkPath(),"/projects");

    if(!workRootPath){
        workRootPath = path.join(tempPath,appliationName);
    }
    if (fs.existsSync(workRootPath)) {
        console.log(chalk.red('  ***WARNING!*** target directory is existed! '));
        let removeFiles = 'rm -rf ' + workRootPath;
        if(!executeTools.executeCommand(removeFiles,'remove old files')){
            return false;
        };
    }
    const loading = ora('processing ...');// 设置loading效果
    const template = await projectSetup.fetchTemplateConfig(templateName);
    const success = await projectSetup.initProjectByTemplate(template,configData,workRootPath);
    if (!success){
        loading.fail(chalk.red('project creating failure !'));
        return "";
    }
    loading.succeed('project creating success!');
    return workRootPath;
    
}
const getTempWorkPath = (newPath) =>{
   return projectSetup.getTempWorkPath(newPath);
}
const getSupportApplications = () =>{
    return projectSetup.getSupportApplications();
}
module.exports.getSupportApplications = getSupportApplications;
module.exports.getTempWorkPath = getTempWorkPath;
module.exports.createProject = createProject;
module.exports.createProjectSet = createProjectSet;
