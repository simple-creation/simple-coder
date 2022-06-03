
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
    console.log('current target root Path----->', targetRootPath);
    if(!targetName){
        console.log('create all');
    }else{
        console.log('create ',targetName);
    }
    
    console.log('create module[', moduleDefine.moduleName, ']...')


    moduleDefine.moduleName = codeTools.firstLower(moduleDefine.moduleName);
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
        targetFile = path.join(targetPath, "Index.jsx");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        templateFile = path.join(templateRootPath, "Add.jsx");
        targetPath = pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile = path.join(targetPath, "Add.jsx");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        templateFile = path.join(templateRootPath, "Update.jsx");
        targetPath = pageRootPath;
        codeTools.createDirectoryEx(targetPath);
        targetFile = path.join(targetPath, "Update.jsx");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);
    }

    if ((!targetName) || targetName.toLowerCase() == 'route') {
        let modulePath = '/' + moduleName;
        let moduleHomePath = modulePath + '/home';
        let componentPath = './' + moduleName + '/Index';
        const routesFile = path.join(targetRootPath, './config/routes.js');
       
        let routes = codeTools.loadES6ModuleObject(routesFile);
        let newRoute = {
            path: modulePath,
            name: moduleName,
            icon: "translation",
            routes: [
                {
                    path: moduleHomePath,
                    name: 'home',
                    component: componentPath,
                },
                { component: './404' }
            ]
        }
        
       for (let index = 0; index < routes.length; index++){
           //console.log(routes[index]);
           if (moduleName === routes[index].name){
               routes.splice(index,1);
           }
       }
       //routes.push(newRoute);
       //把新路由插入到第二个位置，因为如果加到尾部，会被404页面拦截
       routes.splice(1,0,newRoute);
      
        //console.log('new routes----------\b\n', JSON.stringify(routes,null,'\t'));

        moduleDefine.routes = JSON.stringify(routes,null,'\t');

        const templateRoutesPath = path.join(__dirname, "../../templates", template.templateRootPath);
        templateFile = path.join(templateRoutesPath, "Routes.js");
        targetPath = path.join(targetRootPath, '/config');
        targetFile = path.join(targetPath, "routes.js");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

    }

}

module.exports = async (serviceName, moduleName, targetName) => {

    const template = fetchTemplateConfig('web-admin:antd-pro');

   
    const targetRootPath = path.join(process.cwd());
    let templateRootPath = path.join(__dirname, "../../templates", template.templateRootPath);
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
    
    moduleName = codeTools.firstLower(moduleName);
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

