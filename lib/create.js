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
const setupTools = require('./setup');

module.exports = async (args) => {
    let result = true;
    const projectName = args[0];
    const { templateName } = await Inquirer.prompt({
        name: 'templateName',
        type: 'list',
        message: 'please choice template to create project',
        choices: templates,
    });

    const template = templates.find(item => item.name === templateName);
    if (!template.url) {
        console.log(chalk.red('downloading fatal：该模版正在开发中...'));
        return false;
    };

    if(!projectName){
        console.log('***WARNING!*** project name can not be empty !');
        return false;
    }
    const workRootPath = path.join(process.cwd(),projectName);
    const configData = await setupTools.obtainProjectConfig(template,projectName);

    const loading = ora('processing ...');// 设置loading效果
  
    await setupTools.initProjectByTemplate(template,configData,workRootPath);
    loading.succeed('create project success');
    return result;
};



