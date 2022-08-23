const Inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const { promisify } = require('util');
const downloadGitRepo = require('download-git-repo');
const download = promisify(downloadGitRepo);
const { templates, licenses, frameworkTemplates } = require('./const.js');
const ejs = require('ejs');
const codeTools = require('./code-tools');
const executeTools = require('./execute-tool');


const getSupportApplications = () => {
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
    const configData = await obtainProjectConfigData(template, projectName);
    console.log('input config data -->', configData);
    await setupProjectInfo(template, configData, workRootPath);
    return true;

};

const setupProjectByTemplate = async (template, configData, workRootPath) => {
    let result = true;
    //const appliationName = configData.name;
    const loading = ora('config project and propare framework components...');
    try {
        result = await setupProjectInfo(template, configData, workRootPath);
        result = await prepareCompnentsCode(template, workRootPath);
        loading.succeed('project config success');
        return result;
    } catch (error) {
        loading.fail(chalk.red('config project fatal:')); // 结束loading 
        console.log(error);
        return false;
    };



}

const initProjectByTemplate = async (template, configData, workRootPath) => {
    let result = true;
    //const appliationName = configData.name;

    result = await fetchTemplateCode(template, workRootPath);
    if (!result) {
        return false;
    }
    const loading = ora('config project and propare framework components...');
    try {
        result = await setupProjectInfo(template, configData, workRootPath);
        result = await prepareCompnentsCode(template, workRootPath);
        loading.succeed('project config success');
        return result;
    } catch (error) {
        loading.fail(chalk.red('config project fatal:')); // 结束loading 
        console.log(error);
        return false;
    };



}

const fetchTemplateConfig = async (templateName) => {

    const template = templates.find(item => item.name === templateName);
    if (template && template.url) {
        return template;
    } else {
        console.log(chalk.red('不支持当前项目类型...'));
        return null;
    }

}

const fetchTemplatePathByConfig = async (templateName) => {

    const template = templates.find(item => item.name === templateName);
    if (template && template.url) {
        let templateRootPath = path.join(__dirname, '../', template.templateRootPath);
        return templateRootPath;
    } else {
        console.log(chalk.red('不支持当前项目类型...'));
        return "";
    }

}

// 从远程下载项目模版
const fetchTemplateCode = async (template, workRootPath) => {

    const tempProjectRootPath = workRootPath;

    const loading = ora('downloading ...');// 设置loading效果

    loading.start();// 开始loading
    try {
        const data = await download(template.url, tempProjectRootPath, { clone: true });
        loading.succeed('downloading project template success');// 结束loading

        const projectGitPath = path.join(tempProjectRootPath, ".git");
        let removeGitFiles = 'rm -rf ' + projectGitPath;
        let resultExecute = executeTools.executeCommand(removeGitFiles, 'clean git files');
        return true;

    } catch (error) {
        loading.fail(chalk.red('downloading fatal:')); // 结束loading 
        console.log(error);
        return false;
    };



};
const downloadFrameworkByTemplate = async (template, tempPath) => {
    const frameworkRootPath = path.join(tempPath, template.name);
    const frameworkResult = await download(template.url, frameworkRootPath);
    return frameworkResult;
}
const prepareCompnentsCode = async (template, workRootPath) => {
    if (!template.frameworkName) {
        return true;
    }
    const frameworkTemplate = frameworkTemplates.find(item => item.name === template.frameworkName);

    const tempPath = getTempWorkPath('framework');
    const frameworkTempPath = path.join(tempPath, frameworkTemplate.name);
    const frameworkComponentsPath = path.join(frameworkTempPath, frameworkTemplate.componentsSrcPath);
    const projectComponentsPath = path.join(workRootPath, template.componentsSrcPath);

    const loading = ora('start to prepare framework components code  ......');
    if (fs.existsSync(frameworkTempPath) && fs.existsSync(frameworkComponentsPath)) {
        // let removeFiles = 'rm -rf ' + frameworkTempPath;
        // if(!executeTools.executeCommand(removeFiles,'remove old framework files')){
        //     return false;
        // };
        // codeTools.createDirectoryEx(frameworkTempPath);
    } else {
        codeTools.createDirectoryEx(frameworkTempPath);
        const fetchTemplateCodeResult = await fetchTemplateCode(frameworkTemplate, frameworkTempPath);
        if (!fetchTemplateCodeResult) {
            loading.fail(chalk.red("fetch framework template code failure!"));
            return false;
        }
    }
   
    //拷贝framework中的界面组件到项目中，以方便定制个性化组件
    //codeTools.copyDirEx(frameworkComponentsPath, projectComponentsPath);

    loading.succeed('copying framework components success');
    return true;

}
const fetchLocalThemes = (projectName) => {

    const localTemplatePath = path.join(process.cwd(), projectName, '.templates');
    const localConfigFilePath = path.join(localTemplatePath, './config.js');
    console.log('config path--->', localConfigFilePath);
    if (!fs.existsSync(localConfigFilePath)) {
        return null;
    }
    const localConfig = require(localConfigFilePath);
    if (!localConfig.themes) {
        return null;
    } else {
        return localConfig.themes;
    }

}
const setupProjectInfo = async (template, configData, workRootPath) => {

    const applicationName = configData.name;
    const appId = configData.appId;
    let replaceMap = {};
    if (appId) {
        replaceMap["{APP_ID}"] =  appId;
    }
    if(applicationName){
        replaceMap["{APP_NAME}"] =  applicationName;
    }

    if (configData.apiServer) {
        replaceMap["{API_GATEWAY}"] = configData.apiServer;
    }

    if (configData.apiServerPath) {
        replaceMap["{SERVICE_PATH}"] = configData.apiServerPath;
    }
    if (configData.themeName) {
        replaceMap["{THEME_NAME}"] = configData.themeName;
        
    }


    if (template.id == 'server-java') {


        replaceMap["service-java-template"] = applicationName;
        replaceMap["java-service"] = applicationName;
        replaceMap["{SERVICE_NAME}"] = applicationName;

        const targetServicePOMfile = path.join(workRootPath, "service/pom.xml");
        const targetApiPOMfile = path.join(workRootPath, "api/pom.xml");
        const targetParentPOMfile = path.join(workRootPath, "pom.xml");
        const targetDronefile = path.join(workRootPath, ".drone.yml");
        const targetApplicationConfigfile = path.join(workRootPath, "service/src/main/resources/application.yml");
        codeTools.replaceFileContent(targetServicePOMfile, replaceMap);
        codeTools.replaceFileContent(targetApiPOMfile, replaceMap);
        codeTools.replaceFileContent(targetParentPOMfile, replaceMap);

        codeTools.replaceFileContent(targetApplicationConfigfile, replaceMap);
        codeTools.replaceFileContent(targetDronefile, replaceMap);
        return true;
    }

    if (template.id == 'web-antd-pro') {
        // replaceMap["web-antd"] = applicationName;

        // if (configData.apiServer) {
        //     replaceMap["https://api.zhangyongqiao.com"] = configData.apiServer;
        //     replaceMap["{API_GATEWAY}"] = configData.apiServer;
        // }

        // if (configData.apiServerPath) {
        //     replaceMap["java-service"] = configData.apiServerPath;
        //     replaceMap["{SERVICE_PATH}"] = configData.apiServerPath;
        // }

        if (configData.themeName) {
            replaceMap["themes/default"] = "themes/" + configData.themeName;
        }
        const targetDronefile = path.join(workRootPath, ".drone.yml");
        const targetReleasefile = path.join(workRootPath, "release/nginx.conf");
        const targetApplicationConfigfile = path.join(workRootPath, "config/config.js");
        codeTools.replaceFileContent(targetApplicationConfigfile, replaceMap);
        codeTools.replaceFileContent(targetDronefile, replaceMap);
        codeTools.replaceFileContent(targetReleasefile, replaceMap);
        return true;
    }

    if (template.id == 'web-nextjs') {
        // replaceMap["web-antd"] = applicationName;
       

        // if (configData.apiServer) {
        //     //replaceMap["api.zhangyongqiao.com"] = configData.apiServer;
        //     replaceMap["{API_GATEWAY}"] = configData.apiServer;

        // }

        // if (configData.apiServerPath) {
        //     replaceMap["{SERVICE_PATH}"] = configData.apiServerPath;
        // }

        // if (configData.themeName) {
        //     replaceMap["{THEME_NAME}"] = configData.themeName;
            
        // }
        const targetDronefile = path.join(workRootPath, ".drone.yml");
        const targetReleasefile = path.join(workRootPath, "release/nginx.conf");
        const targetApplicationConfigfile = path.join(workRootPath, "config/config.js");
        codeTools.replaceFileContent(targetApplicationConfigfile, replaceMap);
        codeTools.replaceFileContent(targetDronefile, replaceMap);
        codeTools.replaceFileContent(targetReleasefile, replaceMap);
        return true;
    }

    if (template.id == 'mini-taro') {

        replaceMap["mini-taro-template"] = applicationName;

        // if (configData.apiServer) {
        //     replaceMap["https://api.zhangyongqiao.com"] = configData.apiServer;
        //     // replaceMap["{API_GATEWAY}"] = configData.apiServer;
        // }

        // if (configData.apiServerPath) {
        //     replaceMap["java-service"] = configData.apiServerPath;
        //     replaceMap["{SERVICE_PATH}"] = configData.apiServerPath;
        // }

        // if (configData.themeName){
        //     replaceMap["themes/default"] = "themes/" + themeName;
        // }
        const targetDronefile = path.join(workRootPath, ".drone.yml");
        const targetReleasefile = path.join(workRootPath, "release/nginx.conf");
        const targetApplicationConfigfile = path.join(workRootPath, "config/config.js");
        const targetProjectConfigfile = path.join(workRootPath, "project.config.json");
        const targetProjectTTConfigfile = path.join(workRootPath, "project.tt.json");

        codeTools.replaceFileContent(targetApplicationConfigfile, replaceMap);
        codeTools.replaceFileContent(targetProjectConfigfile, replaceMap);
        codeTools.replaceFileContent(targetProjectTTConfigfile, replaceMap);

        codeTools.replaceFileContent(targetDronefile, replaceMap);
        codeTools.replaceFileContent(targetReleasefile, replaceMap);

        return true;
    }
    return true;

}

// 获取项目可配置信息
const obtainProjectConfigData = async (applicationType, projectName) => {

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
    if (applicationType === 'server') {
        return Inquirer.prompt(inputParams);
    }

    //前端通用属性
    inputParams.push({
        type: "input",
        message: "Entry project's api server host:",
        name: "apiServer",
        default: "https://api.zhangyongqiao.com",
    });
    inputParams.push({
        type: "input",
        message: "Entry project's api server path:",
        name: "apiServerPath",
        default: "/java-service",
    });
    if ((applicationType === 'web') || (applicationType === 'mini') || (applicationType === 'h5')) {
        const supportThemes = fetchLocalThemes(projectName);
        if (supportThemes) {
            inputParams.push({
                type: "rawlist",
                message: "Entry Web UI Theme Name",
                name: "themeName",
                choices: supportThemes,
            });
        }

    }

    return Inquirer.prompt(inputParams);
};

const getTempWorkPath = (newPath) => {
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    let tempPath = path.join(USER_HOME, ".temp/simple-coder");
    if (newPath) {
        tempPath = path.join(tempPath, newPath);
    }
    if (!fs.existsSync(tempPath)) {
        codeTools.createDirectoryEx(tempPath);
    }
    return tempPath;
}


const createProjectInConsole = async (projectName, templateName, configData, projectRootPath) => {

    if(!projectName){
        console.log(chalk.red('  ***WARNING!*** project name can not be empty !'));
        return false;
    }
    console.log('temlate name -->', templateName);
    const template = await fetchTemplateConfig(templateName);
    if (!template || !template.url) {
        console.log(chalk.red('fatal：该模版正在开发中...'));
        return false;
    }else{
        console.log('matched template--->',template);
    };
    const workRootPath = path.join(projectRootPath, projectName);
    if (fs.existsSync(workRootPath)) {
        console.log(chalk.red('  ***WARNING!*** Target directory is existed! please remove old directory or change other one! '));
        return false;
    }
    await fetchTemplateCode(template,workRootPath);
    if (!configData){
        configData = await obtainProjectConfigData(template.type,projectName);
    }
    await setupProjectByTemplate(template, configData, workRootPath);

}

const createProjectInWeb = async (configData, workRootPath) => {

    let result = true;
    if (!configData.name){
        console.log('  *** application name not found!')
        return "";
    }
    const appliationName = configData.name;
    const templateName   = configData.templateName;


    if(!workRootPath){
        const tempPath = path.join(getTempWorkPath(),"/projects");
        workRootPath = path.join(tempPath,appliationName);
    }
    if (fs.existsSync(workRootPath)) {
        console.log(chalk.red('  ***WARNING!*** target directory is existed! '));
        let removeFiles = 'rm -rf ' + workRootPath;
        if(!executeTools.executeCommand(removeFiles,'remove old files')){
            return false;
        };
    }
    const template = await fetchTemplateConfig(templateName);
    if (!template || !template.url) {
        console.log(chalk.red('fatal：该模版正在开发中...'));
        return false;
    };
  
    await fetchTemplateCode(template,workRootPath);
    //await obtainProjectConfigData(template.type,projectName);
    await setupProjectByTemplate(template, configData, workRootPath);

}

module.exports.createProjectInWeb = createProjectInWeb;
module.exports.createProjectInConsole = createProjectInConsole;
module.exports.initProjectByTemplate = initProjectByTemplate;
module.exports.setupProjectByTemplate = setupProjectByTemplate;
module.exports.fetchTemplateCode = fetchTemplateCode;
module.exports.setProjectConfig = setProjectConfig;
module.exports.fetchTemplateConfig = fetchTemplateConfig;
module.exports.obtainProjectConfig = obtainProjectConfigData;
module.exports.setupProjectInfo = setupProjectInfo;
module.exports.prepareCompnentsCode = prepareCompnentsCode;
module.exports.getTempWorkPath = getTempWorkPath;
module.exports.getSupportApplications = getSupportApplications;


