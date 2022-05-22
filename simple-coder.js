#!/usr/bin/env node

var path = require('path');
const chalk = require('chalk');
const ora = require('ora');
var projectSetup = require('./lib/setup');

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
        console.log('***WARNING!*** Target directory is existed! ');
        let removeFiles = 'rm -rf ' + workRootPath;
        if(!executeTools.executeCommand(removeFiles,'remove old files')){
            return false;
        };
    }
   
    const template = await projectSetup.fetchTemplateConfig(templateName);
    await projectSetup.initProjectByTemplate(template,configData,workRootPath);
    return workRootPath;
    
}
const getTempWorkPath = async () =>{
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    const tempPath = path.join(USER_HOME,".temp/simple-coder");
    if (!fs.existsSync(tempPath)) {
        codeTools.createDirectoryEx(tempPath);
    }
    return tempPath;
}
const getSupportApplications = async() =>{
    return projectSetup.getSupportApplications();
}
module.exports.getSupportApplications = getSupportApplications;
module.exports.getTempWorkPath = getTempWorkPath;
module.exports.createProject = createProject;
