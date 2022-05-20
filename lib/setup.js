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


const setup = async (args) => {
    const projectName = args[0];
    const { templateName } = await Inquirer.prompt({
        name: 'templateName',
        type: 'list',
        message: 'please choice template to create project',
        choices: templates,
    });

    const template = templates.find(item => item.name === templateName);
    if (!template.url) {
        console.log(chalk.red('不支持当前项目类型...'));
        return false;
    };
    const configData = await obtainProjectConfigData(template,projectName);
    console.log('input config data -->',configData);
    await setupProjectInfo(template,configData,true);
    return true;
  
};

// 从远程下载项目模版
const fetchTemplateCode = async (template, projectName) => {
    if(!projectName){
        console.log('***WARNING!*** project name can not be empty !');
        return false;
    }
    const tempProjectRootPath = path.join(process.cwd(),projectName);
    if (fs.existsSync(tempProjectRootPath)) {
        console.log('***WARNING!*** Target directory is existed! please remove old directory or change other one! ');
        return false;
    }
    let removeTempProject = 'rm -rf ' + tempProjectRootPath;
    executeTools.executeCommand(removeTempProject,'clean old project files');

    
    const loading = ora('downloading ...');// 设置loading效果

    loading.start();// 开始loading
    try {
        const data = await download(template.url, tempProjectRootPath,{clone:true});
        loading.succeed('downloading success');// 结束loading

        const projectGitPath = path.join(tempProjectRootPath,".git");
        let removeGitFiles = 'rm -rf ' + projectGitPath;
        executeTools.executeCommand(removeGitFiles,'clean git files');
        return true;
       
    } catch (error) {
        loading.fail('downloading fatal：'); // 结束loading 
        console.log(error);
        return false;
    };

    

};


const setupProjectInfo = async (template, configData, isInWorkPath) => {
   
    let workPath = applicationName = configData.name;

    if (isInWorkPath){
        workPath = "./";
    }
    //if (template.name =='service:spring-boot'){
    if (template.id =='java-service'){    

        if (configData.name){
            applicationName = configData.name;
        }
        
        let replaceMap = {};
        replaceMap["service-java-template"] = applicationName;
        replaceMap["service-java-template-api"] = applicationName + "-api";
        replaceMap["java-service"] = applicationName;
        
        const targetServicePOMfile = path.join(process.cwd(),workPath,"service/pom.xml");
        const targetApiPOMfile = path.join(process.cwd(),workPath,"api/pom.xml");
        const targetParentPOMfile = path.join(process.cwd(),workPath,"pom.xml");
        const targetDronefile = path.join(process.cwd(),workPath,".drone.yml");
        const targetApplicationConfigfile = path.join(process.cwd(),workPath,"service/src/main/resources/application.yml");
        codeTools.replaceFileContent(targetServicePOMfile,replaceMap);
        codeTools.replaceFileContent(targetApiPOMfile,replaceMap);
        codeTools.replaceFileContent(targetParentPOMfile,replaceMap);

        codeTools.replaceFileContent(targetApplicationConfigfile,replaceMap);
        codeTools.replaceFileContent(targetDronefile,replaceMap);
        return true;
    }

    if (template.id =='antd-pro-web'){    

        if (configData.name){
            applicationName = configData.name;
        }
        
        let replaceMap = {};
        replaceMap["application-name"] = applicationName;
        if (configData.api-server){
            replaceMap["api-server"] = applicationName;
        }
        const targetDronefile = path.join(process.cwd(),workPath,".drone.yml");
        const targetApplicationConfigfile = path.join(process.cwd(),workPath,"service/src/main/resources/application.yml");
        codeTools.replaceFileContent(targetApplicationConfigfile,replaceMap);
        codeTools.replaceFileContent(targetDronefile,replaceMap);
        return true;
    }

}

// 获取项目可配置信息
const obtainProjectConfigData = async (template, projectName) => {
    let inputParams = [
        {
            type: "input",
            message: "Entry your project's name:",
            name: "name",
            default: projectName
        }];
    if (template.type && template.type=="frontend"){
        inputParams.push( {
            type: "input",
            message: "Entry project's api server:",
            name: "apiServer",
            default: "api.zhangyongqiao.com",
        });
    }
    return Inquirer.prompt(inputParams);
};

// 添加基本信息
const inBaseInfo = async (templateName, projectName) => {
    Inquirer.prompt([
        {
            type: "input",
            message: "Entry your project's name:",
            name: "name",
            default: projectName
        },
        {
            type: "input",
            message: "Entry your project's description:",
            name: "description",
            default: ''
        },
        {
            type: "confirm",
            message: "Choice your project's private:",
            name: "private",
            default: false
        },
        {
            type: "input",
            message: "Entry your project's one keyword",
            name: "keywords",
            default: ''
        },
        {
            type: "input",
            message: "Entry your project's author",
            name: "author",
            default: ''
        },
        {
            type: "list",
            message: "Choice your project's license",
            name: "license",
            choices: licenses,
            default: 'MIT'
        }
    ]).then(data => {
        renderFile(templateName, projectName, data);
    });
};

module.exports.setup = setup;
module.exports.fetchTemplateCode = fetchTemplateCode;
module.exports.obtainProjectConfig = obtainProjectConfigData;
module.exports.setupProjectInfo = setupProjectInfo;
