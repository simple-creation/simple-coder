const Inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const { promisify } = require('util');
const downloadGitRepo = require('download-git-repo');
const download = promisify(downloadGitRepo);
const { templates, licenses,frameworkTemplates } = require('./const.js');

const codeTools = require('./code-tools');
const executeTools = require('./execute-tool');
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
    await setupTools.createProjectInConsole(projectName,templateName,null,process.cwd());
    loading.succeed('create project success');
    // const template = templates.find(item => item.name === templateName);
    // if (!template.url) {
    //     console.log(chalk.red('downloading fatal：该模版正在开发中...'));
    //     return false;
    // };

    // if(!projectName){
    //     console.log(chalk.red('  ***WARNING!*** project name can not be empty !'));
    //     return false;
    // }
    // const workRootPath = path.join(process.cwd(),projectName);
    // if (fs.existsSync(workRootPath)) {
    //     console.log(chalk.red('  ***WARNING!*** Target directory is existed! please remove old directory or change other one! '));
    //     return false;
    // }
   
    // result =  await setupTools.fetchTemplateCode(template,workRootPath);
    // if (!result){
    //     return false;
    // } 
    // const configData = await setupTools.obtainProjectConfig(template.type,projectName);

    // const loading = ora('processing ...');// 设置loading效果
   
    // await setupTools.setupProjectByTemplate(template,configData,workRootPath);
    // loading.succeed('create project success');
    // return result;
};



