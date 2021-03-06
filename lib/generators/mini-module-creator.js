
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Inquirer = require('inquirer');
const { templates, licenses, frameworkTemplates } = require('../const.js');
const codeTools = require('../code-tools');
const codeOperator = require('../operation');
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

    const localTemplatePath = path.join(process.cwd(), '.templates');
    const localConfigFilePath = path.join(localTemplatePath, './config.js');
    console.log('config path--->', localConfigFilePath);
    if (!fs.existsSync(localConfigFilePath)) {
        return null;
    }
    const localConfig = require(localConfigFilePath);
    if (!localConfig) {
        return null;
    } else {
        return localConfig;
    }

}

function createModuleFiles(templateRootPath, targetRootPath, moduleDefine, template, targetName) {
    moduleDefine.moduleName = codeTools.firstLower(moduleDefine.moduleName);
    console.log('current target root Path-->', targetRootPath);
    // console.log('current target class-->', targetName);
    console.log('create module[', moduleDefine.moduleName, ']...')
    let haveTarget = false;
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
        haveTarget = true;

        templateFile = path.join(templateRootPath, "Model.js");
        templateFileLowCase = path.join(templateRootPath, "model.js");
        if (fs.existsSync(templateFileLowCase)){templateFile = templateFileLowCase};
        if (fs.existsSync(templateFile)) {
            targetPath = modelPath;
            targetFile = path.join(targetPath, moduleDefine.moduleClassName + "Model.js");
            codeTools.generateCode(templateFile, moduleDefine, targetFile);
        }

    }

    //create module pages objects
    if ((!targetName) || targetName.toLowerCase() == 'page') {
        haveTarget = true;

        templateFile = path.join(templateRootPath, "Index.jsx");
        templateFileLowCase = path.join(templateRootPath, "index.jsx");
        if (fs.existsSync(templateFileLowCase)){templateFile = templateFileLowCase};
        if (fs.existsSync(templateFile)) {
            targetPath = pageRootPath;
            //codeTools.createDirectoryEx(targetPath);
            targetFile = path.join(targetPath, "index.jsx");
            codeTools.generateCode(templateFile, moduleDefine, targetFile);
        }

        templateFile = path.join(templateRootPath, "Index.config.js");
        templateFileLowCase = path.join(templateRootPath, "index.config.js");
        if (fs.existsSync(templateFileLowCase)){templateFile = templateFileLowCase};
        if (fs.existsSync(templateFile)) {

            targetPath = pageRootPath;
            // codeTools.createDirectoryEx(targetPath);
            targetFile = path.join(targetPath, "index.config.js");
            codeTools.generateCode(templateFile, moduleDefine, targetFile);
        }

        templateFile = path.join(templateRootPath, "Index.less");
        templateFileLowCase = path.join(templateRootPath, "index.less");
        if (fs.existsSync(templateFileLowCase)){templateFile = templateFileLowCase};
        if (fs.existsSync(templateFile)) {

            targetPath = pageRootPath;
            // codeTools.createDirectoryEx(targetPath);
            targetFile = path.join(targetPath, "index.less");
            codeTools.generateCode(templateFile, moduleDefine, targetFile);
        }

        templateFile = path.join(templateRootPath, "Detail.jsx");
        templateFileLowCase = path.join(templateRootPath, "detail.jsx");
        if (fs.existsSync(templateFileLowCase)){templateFile = templateFileLowCase};
        if (fs.existsSync(templateFile)) {

            targetPath = pageRootPath;
            // codeTools.createDirectoryEx(targetPath);
            targetFile = path.join(targetPath, "detail.jsx");
            codeTools.generateCode(templateFile, moduleDefine, targetFile);
        }

        templateFile = path.join(templateRootPath, "Detail.config.js");
        templateFileLowCase = path.join(templateRootPath, "detail.config.js");
        if (fs.existsSync(templateFileLowCase)){templateFile = templateFileLowCase};
        if (fs.existsSync(templateFile)) {

            targetPath = pageRootPath;
            // codeTools.createDirectoryEx(targetPath);
            targetFile = path.join(targetPath, "detail.config.js");
            codeTools.generateCode(templateFile, moduleDefine, targetFile);
        }

        templateFile = path.join(templateRootPath, "Detail.less");
        templateFileLowCase = path.join(templateRootPath, "detail.less");
        if (fs.existsSync(templateFileLowCase)){templateFile = templateFileLowCase};
        if (fs.existsSync(templateFile)) {

            targetPath = pageRootPath;
            // codeTools.createDirectoryEx(targetPath);
            targetFile = path.join(targetPath, "detail.less");
            codeTools.generateCode(templateFile, moduleDefine, targetFile);
        }


        //common.less
        templateFile = path.join(templateRootPath, "Common.less");
        templateFileLowCase = path.join(templateRootPath, "common.less");
        if (fs.existsSync(templateFileLowCase)){templateFile = templateFileLowCase};
        if (fs.existsSync(templateFile)) {

            targetPath = pageRootPath;
            targetFile = path.join(targetPath, "common.less");
            codeTools.generateCode(templateFile, moduleDefine, targetFile);
        }


        //copy components
        templateComponentsPath = path.join(templateRootPath, "Components");
        templateComponentsPathLowCase = path.join(templateRootPath, "components");
        if (fs.existsSync(templateComponentsPathLowCase)){templateComponentsPath = templateComponentsPathLowCase};
        if (fs.existsSync(templateComponentsPath)) {

            targetComponentsPath = path.join(targetPath, "components");
            codeTools.copyDirEx(templateComponentsPath,targetComponentsPath);
        }
    }

    if ((!targetName) || targetName.toLowerCase() == 'route') {

        haveTarget = true;

        const routesFile = path.join(targetRootPath, './src/app.config.js');

        let config = codeTools.loadES6ModuleObject(routesFile);
        let newHomePage = 'pages/' + moduleName + '/index';
        let newDetailPage = 'pages/' + moduleName + '/detail';


        if (config.pages) {
            let pages = config.pages;
            let newPages = [];
            for (let index = 0; index < pages.length; index++) {
                //console.log(pages[index]);
                if ((newHomePage === pages[index]) || (newDetailPage === pages[index])) {
                    continue;
                }
                newPages.push(pages[index]);
            }
            newPages.push(newHomePage);
            newPages.push(newDetailPage);
            config.pages = newPages;
            //console.log('final new config content----------\b\n', JSON.stringify(config, null, '\t'));

        }


        moduleDefine.config = JSON.stringify(config, null, '\t');

        const templateRoutesPath = path.join(__dirname, "../../templates", template.templateRootPath);
        templateFile = path.join(templateRoutesPath, "Routes.js");
        targetFile = routesFile;
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

    }

    if (!haveTarget){
         console.log(chalk.red('incorrect target name ! please confirm input correct target!'))
         return false;
    }   
    return true;     

}

module.exports = async (moduleName, targetName) => {
  
    let result  = true;

    const template = fetchTemplateConfig('mini-program:taro');
    console.log(template);
    let templateRootPath = path.join(__dirname, "../../templates", template.templateRootPath);
    const targetRootPath = path.join(process.cwd());


    const localConfig = fetchLocalConfig();
    if (localConfig) {
        const { moduleTypeName } = await Inquirer.prompt({
            name: 'moduleTypeName',
            type: 'rawlist',
            message: 'please choice module template to create module',
            choices: localConfig.moduleTemplates,
        });
        const moduleType = localConfig.moduleTemplates.find(item => item.name === moduleTypeName);
        templateRootPath = path.join(process.cwd(), '.templates', moduleType.templateRootPath);
    }

    if (moduleName) {
        let moduleDefine = { moduleName: moduleName};
        // moduleDefines.forEach(item => {
        //     if (item.moduleName.toLowerCase() == moduleName.toLowerCase()) {
        //         moduleDefine = item;
        //         console.log('found match module[', moduleName, '] with model name[' + item.modelName +'] continue to create module files...');
        //     }
        // });
        if (moduleDefine) {
            //moduleDefine.packageName = packageName;
            result = createModuleFiles(templateRootPath, targetRootPath, moduleDefine, template, targetName);
        
        } else {
            console.log('module not found!');
            return;
        }
       
    }

    // moduleDefines.forEach(moduleDefine => {
    //     //moduleDefine.packageName = packageName;
    //     createModuleFiles(targetRootPath, moduleDefine,template, targetName);

    // });
    if (result){
        console.log('Successful to create module files!');
    }else{
        console.log('Failed to  create module files!');
    }

}

