#!/usr/bin/env node

var fs = require('fs');
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
    if(!workRootPath){
        const USER_HOME = process.env.HOME || process.env.USERPROFILE;
        const tempPath = path.join(USER_HOME,".temp/simple-coder");
        workRootPath = path.join(tempPath,appliationName);
    }
    
    const template = await projectSetup.fetchTemplateConfig(appliationName);
    await projectSetup.initProjectByTemplate(template,configData,workRootPath);
    return workRootPath;
    
}

module.exports.createProject = createProject;