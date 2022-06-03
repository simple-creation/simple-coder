
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Inquirer = require('inquirer');
const { templates, licenses, frameworkTemplates } = require('../const.js');
const codeTools = require('../code-tools');
const codeOperator = require('../setup');
// require('babel-register')({
//     presets: ['env']
// })


const fetchTemplateConfig = (templateName) => {

    const template = templates.find(item => item.name === templateName);
    if (template && template.url) {
        return template;
    } else {
        console.log(chalk.red('不支持当前项目类型...'));
        return null;
    }

}
const fetchLocalConfig = () => {

    const localTemplatePath = path.join(process.cwd(),'.templates');
    const localConfigFilePath = path.join(localTemplatePath,'./config.js');
    console.log('config path--->', localConfigFilePath);
    if (!fs.existsSync(localConfigFilePath)){
        return null;
    }
    const localConfig = require(localConfigFilePath);
    if (!localConfig){
        return null;
    }else{
        return localConfig;
    }
    
}

function createModuleFiles(templateRootPath,targetRootPath, moduleDefine, template, targetName) {
    console.log('current target root Path-->', targetRootPath);
    console.log('current target class-->', targetName);
    console.log('create module[', moduleDefine.moduleName, ']...')
    // let templateRootPath = path.join(__dirname, "../../templates", template.templateRootPath);

    let moduleName = moduleDefine.moduleName;
    let modelPath = path.join(targetRootPath, template.modelsPath);
    let pageRootPath = path.join(targetRootPath, template.pagesPath, moduleDefine.moduleName);
    codeTools.createDirectoryEx(modelPath);
    codeTools.createDirectoryEx(pageRootPath);

    moduleDefine.moduleClassName = codeTools.firstUpper(moduleDefine.moduleName);
    moduleDefine.moduleName = codeTools.firstLower(moduleDefine.moduleName);
    moduleDefine.modelClassName = moduleDefine.modelName;
    moduleDefine.moduleDtoClassName = moduleDefine.moduleClassName + "Dto";



    let templateFile = '';
    let targetPath = '';
    let targetFile = '';
    //create module Model
    if ((!targetName) || targetName.toLowerCase() == 'model') {

        templateFile = path.join(templateRootPath, "Model.js");
        targetPath = modelPath;
        targetFile = path.join(targetPath, moduleDefine.moduleClassName + "Model.js");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

    }

    //create module pages objects
    if ((!targetName) || targetName.toLowerCase() == 'page') {

        templateFile = path.join(templateRootPath, "Index.jsx");
        targetPath = pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile = path.join(targetPath, "index.jsx");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        templateFile = path.join(templateRootPath, "Index.config.js");
        targetPath = pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile = path.join(targetPath, "index.config.js");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);


        templateFile = path.join(templateRootPath, "Index.less");
        targetPath = pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile = path.join(targetPath, "index.less");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);


        templateFile = path.join(templateRootPath, "Detail.jsx");
        targetPath = pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile = path.join(targetPath, "detail.jsx");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        templateFile = path.join(templateRootPath, "Detail.config.js");
        targetPath = pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile = path.join(targetPath, "detail.config.js");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        templateFile = path.join(templateRootPath, "Detail.less");
        targetPath = pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile = path.join(targetPath, "detail.less");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);
    }

    if ((!targetName) || targetName.toLowerCase() == 'route') {
  
        const routesFile = path.join(targetRootPath, './src/app.config.js');
       
        let config = codeTools.loadES6ModuleObject(routesFile);
        let newHomePage = 'pages/' + moduleName + '/index';
        let newDetailPage = 'pages/' + moduleName + '/detail';

        
        if ( config.pages){
            let pages = config.pages;
            let newPages = [];
            for (let index = 0; index < pages.length; index++){
                //console.log(pages[index]);
                if ((newHomePage === pages[index]) || (newDetailPage === pages[index])) {
                     continue;
                }
                newPages.push(pages[index]);
             }
             newPages.push(newHomePage);
             newPages.push(newDetailPage);
             config.pages = newPages;
             console.log('final new config content----------\b\n', JSON.stringify(config,null,'\t'));

        }
        

        moduleDefine.config = JSON.stringify(config,null,'\t');

        const templateRoutesPath = path.join(__dirname, "../../templates", template.templateRootPath);
        templateFile = path.join(templateRoutesPath, "Routes.js");
        targetFile = routesFile;
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

    }

}

module.exports = async (serviceName, moduleName, targetName) => {

    
    const template = fetchTemplateConfig('mini-program:taro');
    console.log(template);
    let templateRootPath = path.join(__dirname, "../../templates", template.templateRootPath);
    const targetRootPath = path.join(process.cwd());

   
    const localConfig = fetchLocalConfig();
    if(localConfig){
        const {moduleTypeName} = await Inquirer.prompt({
            name: 'moduleTypeName',
            type: 'rawlist',
            message: 'please choice module template to create module',
            choices: localConfig.moduleTemplates,
        });
       const moduleType = localConfig.moduleTemplates.find(item=> item.name=== moduleTypeName);
       templateRootPath = path.join(process.cwd(),'.templates',moduleType.templateRootPath);
    }

    if (moduleName) {
        let moduleDefine = { moduleName: moduleName, serviceName: serviceName };
        // moduleDefines.forEach(item => {
        //     if (item.moduleName.toLowerCase() == moduleName.toLowerCase()) {
        //         moduleDefine = item;
        //         console.log('found match module[', moduleName, '] with model name[' + item.modelName +'] continue to create module files...');
        //     }
        // });
        if (moduleDefine) {
            //moduleDefine.packageName = packageName;
            createModuleFiles(templateRootPath,targetRootPath, moduleDefine, template, targetName);
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

