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


const getSupportApplications = async (s) => {
    return templates;
};

const setProjectConfig = async (args) => {
    const projectName = args[0];
    const { templateName } = await Inquirer.prompt({
        name: 'templateName',
        type: 'list',
        message: 'please choice template to create project',
        choices: templates,
    });

    const workRootPath = path.join(process.cwd());
    const template = fetchTemplateConfig(templateName);
    const configData = await obtainProjectConfigData(template,projectName);
    console.log('input config data -->',configData);
    await setupProjectInfo(template,configData,workRootPath);
    return true;
  
};


const initProjectByTemplate = async (template,configData,workRootPath)=> {
    let result = true;
    //const appliationName = configData.name;
    result =  await fetchTemplateCode(template,workRootPath);
    if (!result){
        return "";
    } 
    //const loading = ora('processing ...');// 设置loading效果
    result = await setupProjectInfo(template,configData,workRootPath);
    result = await prepareCompnentsCode(template,workRootPath);
    //loading.succeed('create project success');
    return result;
    
}

const fetchTemplateConfig =  async (templateName) => {

    const template = templates.find(item => item.name === templateName);
    if (template && template.url) {
        return template;
    }else{
        console.log(chalk.red('不支持当前项目类型...'));
        return null;
    }
    
}
// 从远程下载项目模版
const fetchTemplateCode = async (template, workRootPath) => {
   
    const tempProjectRootPath = workRootPath;
    if (fs.existsSync(tempProjectRootPath)) {
        console.log('***WARNING!*** Target directory is existed! please remove old directory or change other one! ');
        return false;
    }
   
    const loading = ora('downloading ...');// 设置loading效果

    loading.start();// 开始loading
    try {
        const data = await download(template.url, tempProjectRootPath,{clone:true});
        loading.succeed('downloading project template success');// 结束loading

        const projectGitPath = path.join(tempProjectRootPath,".git");
        let removeGitFiles = 'rm -rf ' + projectGitPath;
        let resultExecute = executeTools.executeCommand(removeGitFiles,'clean git files');
        return true;
       
    } catch (error) {
        loading.fail('downloading fatal：'); // 结束loading 
        console.log(error);
        return false;
    };

    

};
const  downloadFrameworkByTemplate = async (template,tempPath)=>{
    const frameworkRootPath = path.join(tempPath,template.name);
    const frameworkResult = await download(template.url,frameworkRootPath);
    return frameworkResult;
}
const  prepareCompnentsCode = async (template,workRootPath) =>{
    if (!template.frameworkName){
        return true;
    }
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    const tempPath = path.join(USER_HOME,".temp/framework");
   
    const loading = ora('start to prepare framework components code  ......');
    if (fs.existsSync(tempPath)){
        let removeFiles = 'rm -rf ' + tempPath;
        if(!executeTools.executeCommand(removeFiles,'remove old files')){
            return false;
        };
        codeTools.createDirectoryEx(tempPath);
    }

    for (let i=0; i <frameworkTemplates.length; i++){
        const templateItem = frameworkTemplates[i];
        await downloadFrameworkByTemplate(templateItem,tempPath);
    }
    const frameworkTemplate = frameworkTemplates.find(item => item.name === template.frameworkName);
    const frameworkComponentsPath = path.join(tempPath,frameworkTemplate.name,frameworkTemplate.componentsSrcPath);
    const projectComponentsPath = path.join(workRootPath,template.componentsSrcPath);
    
    codeTools.copyDirEx(frameworkComponentsPath,projectComponentsPath);

    if (fs.existsSync(tempPath)){
        let removeFiles = 'rm -rf ' + tempPath;
        if(!executeTools.executeCommand(removeFiles,'remove framework temporary files')){
            return false;
        };
    }
    loading.succeed('copying framework components success');

}

const setupProjectInfo = async (template, configData, workRootPath) => {
   
    const applicationName = configData.name;
    const appId           = configData.appId;
    let replaceMap = {};
    if (appId){
        replaceMap["100000"] = appId;
    }

    if (template.id =='server-java'){    
        
        
        replaceMap["service-java-template"] = applicationName;
        replaceMap["java-service"] = applicationName;
        
        const targetServicePOMfile = path.join(workRootPath,"service/pom.xml");
        const targetApiPOMfile = path.join(workRootPath,"api/pom.xml");
        const targetParentPOMfile = path.join(workRootPath,"pom.xml");
        const targetDronefile = path.join(workRootPath,".drone.yml");
        const targetApplicationConfigfile = path.join(workRootPath,"service/src/main/resources/application.yml");
        codeTools.replaceFileContent(targetServicePOMfile,replaceMap);
        codeTools.replaceFileContent(targetApiPOMfile,replaceMap);
        codeTools.replaceFileContent(targetParentPOMfile,replaceMap);

        codeTools.replaceFileContent(targetApplicationConfigfile,replaceMap);
        codeTools.replaceFileContent(targetDronefile,replaceMap);
        return true;
    }

    if (template.id =='web-antd-pro'){    
        replaceMap["web-antd"] = applicationName;
        
        if (configData.apiServer){
            replaceMap["api.zhangyongqiao.com"] = configData.apiServer;
        }
        const targetDronefile = path.join(workRootPath,".drone.yml");
        const targetReleasefile = path.join(workRootPath,"release/nginx.conf");
        const targetApplicationConfigfile = path.join(workRootPath,"config/config.js");
        codeTools.replaceFileContent(targetApplicationConfigfile,replaceMap);
        codeTools.replaceFileContent(targetDronefile,replaceMap);
        codeTools.replaceFileContent(targetReleasefile,replaceMap);
        return true;
    }

    if (template.id =='mini-taro'){    
       
        replaceMap["mini-taro-template"] = applicationName;
        
        if (configData.apiServer){
            replaceMap["api.zhangyongqiao.com"] = configData.apiServer;
        }
        const targetDronefile = path.join(workRootPath,".drone.yml");
        const targetReleasefile = path.join(workRootPath,"release/nginx.conf");
        const targetApplicationConfigfile = path.join(workRootPath,"config/config.js");
        const targetProjectConfigfile = path.join(workRootPath,"project.config.json");
        const targetProjectTTConfigfile = path.join(workRootPath,"project.tt.json");

        codeTools.replaceFileContent(targetApplicationConfigfile,replaceMap);
        codeTools.replaceFileContent(targetProjectConfigfile,replaceMap);
        codeTools.replaceFileContent(targetProjectTTConfigfile,replaceMap);

        codeTools.replaceFileContent(targetDronefile,replaceMap);
        codeTools.replaceFileContent(targetReleasefile,replaceMap);
        
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
        },
        {
            type: "input",
            message: "Entry your project's APP-ID:",
            name: "appId",
            default: '100000',
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


// // 通过模版内容写文件
// const renderFile = (templateName, projectName, data) => {
//     const filename = path.join(__dirname, `./../templates/${templateName}/package.json`);

//     ejs.renderFile(filename, data, {}, function (err, str) {
//         if (err) return console.log(chalk.red('ejs ERROR :', err));
//         init(templateName, projectName, str);
//     });
// }

module.exports.getSupportApplications = getSupportApplications;
module.exports.setProjectConfig = setProjectConfig;
module.exports.initProjectByTemplate = initProjectByTemplate;
module.exports.fetchTemplateConfig = fetchTemplateConfig;
module.exports.fetchTemplateCode = fetchTemplateCode;
module.exports.obtainProjectConfig = obtainProjectConfigData;
module.exports.setupProjectInfo = setupProjectInfo;
module.exports.prepareCompnentsCode = prepareCompnentsCode;

