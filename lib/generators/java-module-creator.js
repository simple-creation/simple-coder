
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const codeTools = require('../code-tools');
const codeOperator = require('../operation');

function createModuleFiles(targetRootPath, moduleDefine, template,targetName) {
    console.log('current target class-->',targetName);
    console.log('create module[', moduleDefine.moduleName, ']...')
    let templateRootPath = path.join(__dirname, "../../templates",template.templateRootPath);

  
    moduleDefine.moduleClassName = codeTools.firstUpper(moduleDefine.moduleName);
    moduleDefine.moduleName = codeTools.firstLower(moduleDefine.moduleName);
    moduleDefine.modelClassName = moduleDefine.modelName;
    moduleDefine.moduleDtoClassName = moduleDefine.moduleClassName + "Dto";

    let templateFile   = '';
    let targetPath     = '';
    let targetFile     = '';

    //create module dao
    if ((!targetName) || targetName.toLowerCase() == 'dao') {
       
        templateFile = path.join(templateRootPath, "Dao.java");
        targetPath = path.join(targetRootPath, "/dao");
        codeTools.createDirectoryEx(targetPath);
        targetFile = path.join(targetPath, moduleDefine.moduleClassName + "Repository.java");

        codeTools.generateCode(templateFile, moduleDefine, targetFile);

    }

    //create module dto objects
    if ((!targetName) || targetName.toLowerCase() == 'dto') {
        
        targetPath = path.join(targetRootPath, "/dto");
        codeTools.createDirectoryEx(targetPath);
        templateFile = path.join(templateRootPath, "Dto.java");
        targetFile = path.join(targetPath, moduleDefine.moduleClassName + "Dto.java");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        templateFile = path.join(templateRootPath, "DtoDetail.java");
        targetFile = path.join(targetPath, moduleDefine.moduleClassName + "DetailDto.java");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);



        templateFile = path.join(templateRootPath, "DtoNew.java");
        targetFile = path.join(targetPath, moduleDefine.moduleClassName + "NewDto.java");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        templateFile = path.join(templateRootPath, "DtoList.java");
        targetFile = path.join(targetPath, moduleDefine.moduleClassName + "sDto.java");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

        // templateFile = path.join(templateRootPath, "DtoDetailList.java");
        // targetFile = path.join(targetPath, moduleDefine.moduleClassName + "DetailsDto.java");
        // codeTools.generateCode(templateFile, moduleDefine, targetFile);
    }

     //create service
    if ((!targetName) || targetName.toLowerCase() == 'service') {
        targetPath = path.join(targetRootPath, "/service");
        codeTools.createDirectoryEx(targetPath);
        templateFile = path.join(templateRootPath, "Service.java");
       
        targetFile = path.join(targetPath, moduleDefine.moduleClassName + "Service.java");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);
    }

     //create controller
    if ((!targetName) || targetName.toLowerCase() == 'controller') {
        targetPath = path.join(targetRootPath, "/controller");
        codeTools.createDirectoryEx(targetPath);
        templateFile = path.join(templateRootPath, "Controller.java");
  
        targetFile = path.join(targetPath, moduleDefine.moduleClassName + "Controller.java");
        codeTools.generateCode(templateFile, moduleDefine, targetFile);

    }
}

module.exports = async (packageName, moduleName, targetName) => {


    const template = await codeOperator.fetchTemplateConfig('server:spring-boot');


    let packagePath = codeTools.javaPackageToPath(packageName);
    let targetRootPath = path.join(process.cwd(), template.sourcePath, packagePath);
    let targetModelPath = path.join(targetRootPath, "model");
    if (!fs.existsSync(targetModelPath)){
        targetModelPath =  path.join(targetRootPath, "models");  
        if (!fs.existsSync(targetModelPath)){
            console.log(chalk.red('***ERROR*** Model Directory not found, please ensure input correct pacakge name and model name!'));
            return false;
        }
    }
    let moduleDefines = codeTools.getPathJavaFileText(targetModelPath); 


    if (moduleName) {
        let moduleDefine;
        moduleDefines.forEach(item => {
            if (item.moduleName.toLowerCase() == moduleName.toLowerCase()) {
                moduleDefine = item;
                console.log('found match module[', moduleName, '] with model name[' + item.modelName +'] continue to create module files...');
            }
        });
        if (moduleDefine) {
            moduleDefine.packageName = packageName;
            createModuleFiles(targetRootPath, moduleDefine,template,targetName);
            console.log('Successful create module files!');
        } else {
            console.log('module not found!');
        }
        return;
    }

    moduleDefines.forEach(moduleDefine => {
        moduleDefine.packageName = packageName;
        createModuleFiles(targetRootPath, moduleDefine,template,targetName);

    });
    console.log('Successful create module files!');

}

