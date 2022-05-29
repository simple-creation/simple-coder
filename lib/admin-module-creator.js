
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { templates, licenses,frameworkTemplates } = require('./const.js');
const codeTools = require('./code-tools');
const codeOperator = require('./setup');

const fetchTemplateConfig =  (templateName) => {

    const template = templates.find(item => item.name === templateName);
    if (template && template.url) {
        return template;
    }else{
        console.log(chalk.red('不支持当前项目类型...'));
        return null;
    }
    
}

function createModuleFiles(targetRootPath, moduleDefine, template,targetName) {
    console.log('current target root Path-->',targetRootPath);
    console.log('current target class-->',targetName);
    console.log('create module[', moduleDefine.moduleName, ']...')
    let templateRootPath = path.join(__dirname, "../templates",template.templateRootPath);
    
    let modelPath = path.join(targetRootPath,template.modelsPath);
    let pageRootPath  = path.join(targetRootPath,template.pagesPath,moduleDefine.moduleName);
    codeTools.createDirectoryEx(modelPath);
    codeTools.createDirectoryEx(pageRootPath);
  
    moduleDefine.moduleClassName = codeTools.firstUpper(moduleDefine.moduleName);
    moduleDefine.moduleName = codeTools.firstLower(moduleDefine.moduleName);
    moduleDefine.modelClassName = moduleDefine.modelName;
    moduleDefine.moduleDtoClassName = moduleDefine.moduleClassName + "Dto";



    let templateFile   = '';
    let targetPath     = '';
    let targetFile     = '';
    //create module Model
    if ((!targetName) || targetName.toLowerCase() == 'model') {
       
        templateFile = path.join(templateRootPath, "Model.js");
        targetPath     = modelPath;
        targetFile     = path.join(targetPath, moduleDefine.moduleClassName + "Model.js");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

    }

    //create module pages objects
    if ((!targetName) || targetName.toLowerCase() == 'pages') {
        
        templateFile = path.join(templateRootPath, "Index.jsx");
        targetPath     =  pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile     = path.join(targetPath, "Index.jsx");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        templateFile = path.join(templateRootPath, "Add.jsx");
        targetPath     =  pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile     = path.join(targetPath, "Add.jsx");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        templateFile = path.join(templateRootPath, "Update.jsx");
        targetPath     =  pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile     = path.join(targetPath, "Update.jsx");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);
    }

    //  //create service
    // if ((!targetName) || targetName.toLowerCase() == 'service') {
       
    //     templateFile = path.join(templateRootPath, "Service.java");
    //     targetPath = path.join(targetRootPath, "/service");
    //     targetFile = path.join(targetPath, moduleDefine.moduleClassName + "Service.java");
    //     codeTools.generateCode(templateFile, moduleDefine, targetFile);
    // }

    //  //create controller
    // if ((!targetName) || targetName.toLowerCase() == 'controller') {
       
    //     templateFile = path.join(templateRootPath, "Controller.java");
    //     targetPath = path.join(targetRootPath, "/controller");
    //     targetFile = path.join(targetPath, moduleDefine.moduleClassName + "Controller.java");
    //     codeTools.generateCode(templateFile, moduleDefine, targetFile);

    // }
}

module.exports = async (serviceName, moduleName, targetName) => {

    const targetRootPath = path.join(process.cwd());
    const template = fetchTemplateConfig('web-admin:antd-pro');
    console.log(template);
  
    if (moduleName) {
        let moduleDefine = {moduleName:moduleName,serviceName: serviceName};
        // moduleDefines.forEach(item => {
        //     if (item.moduleName.toLowerCase() == moduleName.toLowerCase()) {
        //         moduleDefine = item;
        //         console.log('found match module[', moduleName, '] with model name[' + item.modelName +'] continue to create module files...');
        //     }
        // });
        if (moduleDefine) {
            //moduleDefine.packageName = packageName;
            createModuleFiles(targetRootPath, moduleDefine,template,targetName);
            console.log('Successful create module files!');
        } else {
            console.log('module not found!');
        }
        return;
    }

    // moduleDefines.forEach(moduleDefine => {
    //     //moduleDefine.packageName = packageName;
    //     createModuleFiles(targetRootPath, moduleDefine,template, targetName);

    // });
    console.log('Successful create module files!');

}

