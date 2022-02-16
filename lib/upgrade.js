const Inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const { promisify } = require('util');
const downloadGitRepo = require('download-git-repo');
const download = promisify(downloadGitRepo);
const { frameworkTemplates } = require('./const.js');
const ejs = require('ejs');
const codeTools = require('./code-tools');
const executeTools = require('./execute-tool');

module.exports = async (args) => {
   
    await upgradeFrameworks();
    await buildUICreators();
};






const  upgradeFrameworks = async () =>{
    const USER_HOME = process.env.HOME || process.env.USERPROFILE
    const frameworkRootPath = path.join(USER_HOME,".framework");
  
    let removeFrameworkFiles = 'rm -rf ' + frameworkRootPath + "/*";
    executeTools.executeCommand(removeFrameworkFiles,'clean framework files');

    const rest = await prepareFrameworks();
    console.log('Prepare frameworks',rest);
}


const  prepareFrameworks = () =>{
    return Promise.all(frameworkTemplates.map(async(template,index)=>{
        return await downloadFrameworkByTemplate(template);
    }));
    // frameworkTemplates.map(async(template,index)=>{
    //     await downloadFrameworkByTemplate(template);
    // });
}

const  downloadFrameworkByTemplate = async (template)=>{
    const USER_HOME = process.env.HOME || process.env.USERPROFILE
    const frameworkRootPath = path.join(USER_HOME,".framework",template.name);
    const frameworkResult = await download(template.url,frameworkRootPath);
    console.log('finished to downlaod framework===>' + template.name + " ToPath===>" + frameworkRootPath);
    return frameworkResult;
}




const buildUICreators = ()=>{
    return Promise.all(frameworkTemplates.map(async(template,index)=>{
        await buildFrameworkUICreator(template);
    })); 
    
   
}
const buildFrameworkUICreator = async (template)=>{
    if (template.name ==='commonlib'){
        return;
    }
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    console.log('build ui creator ====>', USER_HOME,template.name,template.UICreatorBuildPath);
    const UICreatorPath = path.join(USER_HOME,".framework",template.name, template.UICreatorBuildPath);
    const originPath = process.cwd();

    const nodeModulesPath = path.join(UICreatorPath,"node_modules");
    codeTools.createDirectoryEx(nodeModulesPath);
    const npmInstallCommand = "cd " + UICreatorPath + " && npm install && npm run build-creator";
    executeTools.executeCommand(npmInstallCommand,"build creator!");
   
}