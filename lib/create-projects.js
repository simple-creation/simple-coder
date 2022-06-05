const Inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const { promisify } = require('util');
const downloadGitRepo = require('download-git-repo');
const download = promisify(downloadGitRepo);
const { templates, licenses,frameworkTemplates } = require('./const.js');
const ejs = require('ejs');
const codeTools = require('./code-tools');
const executeTools = require('./execute-tool');
const setupTools = require('./operation');

const createSubProject = async(subProjectName,templateName,configData,projectRootPath)=>{
    const template = templates.find(item => item.name === templateName);
    console.log('template info->',templateName,template);
    if (!template || !template.url) {
        console.log(chalk.red('fatal：该模版正在开发中...'));
        return false;
    };
    const workRootPath = path.join(projectRootPath,subProjectName);
    if (fs.existsSync(workRootPath)) {
        console.log(chalk.red('  ***WARNING!*** Target directory is existed! please remove old directory or change other one! '));
        return false;
    }

    await setupTools.initProjectByTemplate(template,configData,workRootPath);

}

module.exports = async (args) => {
    let result = true;
    const projectName = args[0];
    

    if(!projectName){
        console.log(chalk.red('  ***WARNING!*** project name can not be empty !'));
        return false;
    }
    const workRootPath = path.join(process.cwd(),projectName);
    if (fs.existsSync(workRootPath)) {
        console.log(chalk.red('  ***WARNING!*** Target directory is existed! please remove old directory or change other one! '));
        return false;
    }
    
    let configData = await setupTools.obtainProjectConfig('all',projectName);
    const appIdStart = configData.appId;
    
    const loading = ora('processing ...');// 设置loading效果

    configData.appId = appIdStart + 1;
    let subProjectName = projectName + '-mini';
    await createSubProject(subProjectName,"mini-program:taro",configData,workRootPath);

    configData.appId = appIdStart + 2;
    subProjectName = projectName + '-service';
    await createSubProject(subProjectName,"server:spring-boot",configData,workRootPath);

    configData.appId = appIdStart + 3;
    subProjectName = projectName + '-admin';
    await createSubProject(subProjectName,"web-admin:antd-pro",configData,workRootPath);
   
    loading.succeed('create project success');
    return result;
};



