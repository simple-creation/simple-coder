const Inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const { promisify } = require('util');
const downloadGitRepo = require('download-git-repo');
const download = promisify(downloadGitRepo);
const { templates, licenses,frameworkTemplates } = require('./const.js');

const setupTools = require('./operation');

module.exports = async (args) => {
    let result = true;
    const projectName = args[0];
    const { templateName } = await Inquirer.prompt({
        name: 'templateName',
        type: 'list',
        message: 'please choice template to create project',
        choices: templates,
    });
    const loading = ora('processing ...');// 设置loading效果
    const res =  await setupTools.createProjectInConsole(projectName,templateName,null,process.cwd());
    if (res){

        loading.succeed('create project success');
    }else{
        loading.fail('fail to create project');
    }
    
  
};



