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

    const configData = await setupTools.obtainProjectConfig(template,projectName);

    const result =  await setupTools.fetchTemplateCode(template,configData.name);
    if (!result){
        return false;
    } 

    await setupTools.setupProjectInfo(template,configData);

    return true;
    //await prepareFrameworks();
};



// // 通过模版内容写文件
// const renderFile = (templateName, projectName, data) => {
//     const filename = path.join(__dirname, `./../templates/${templateName}/package.json`);

//     ejs.renderFile(filename, data, {}, function (err, str) {
//         if (err) return console.log(chalk.red('ejs ERROR :', err));
//         init(templateName, projectName, str);
//     });
// }

const  downloadFrameworkByTemplate = async (templateDefault)=>{
    const USER_HOME = process.env.HOME || process.env.USERPROFILE
    const frameworkRootPath = path.join(USER_HOME,".framework",templateDefault.name);
    const frameworkResult = await download(templateDefault.url,frameworkRootPath);
    return frameworkResult;
}
const  prepareFrameworks = async () =>{
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    const frameworkRootPath = path.join(USER_HOME,".framework","simple-framework");
    if (fs.existsSync(frameworkRootPath)){
        return false;
    }
    frameworkTemplates.map(async(template)=>{
        await downloadFrameworkByTemplate(template);
    });
}
const copyUIComponentsAndCleanGit = (projectTemplate,projectName)=>{
    const projectGitPath = path.join(process.cwd(),projectName,".git");
    let removeGitFiles = 'rm -rf ' + projectGitPath;
    executeTools.executeCommand(removeGitFiles,'clean git files');
    if (projectTemplate.name ==='service:spring-boot'){
        return;
    }
    const frameworkTemplate = frameworkTemplates.find(item => item.name === projectTemplate.frameworkName);
    
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    const frameworkUIComponentsPath = path.join(USER_HOME,".framework",frameworkTemplate.name, frameworkTemplate.componentSrcPath);
    const projectUIComponentsPath = path.join(process.cwd(),projectName,projectTemplate.pagesPath, "components");
    codeTools.copyDirEx(frameworkUIComponentsPath,projectUIComponentsPath);
}

