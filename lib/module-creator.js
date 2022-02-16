
const path = require('path');
const fs = require('fs');
const codeTools = require('./code-tools');



module.exports = async (moduleName) => {
    const projectTemplate = codeTools.getConfig();
    if(!projectTemplate){
        console.log('unknow project framework type! exited !')
        return;
    }
 
    let templateRootPath = path.join(__dirname,"../templates",projectTemplate.templateRootPath);
    let templateFile = path.join(templateRootPath,'model.js');

    //把model对象写入models 目录中，以备以后调用。
    let outputFilename = codeTools.firstUpper(moduleName) + 'Model.js';
    let outputPath = path.join(process.cwd(),projectTemplate.modelsPath);
    let outputFile =  path.join(outputPath, outputFilename);
    codeTools.createDirectoryEx(outputPath);
    codeTools.generateCode(templateFile, {moduleName:moduleName},outputFile);

    //在页面目录中创建模块文件夹
    let pageModulePath =  path.join(process.cwd(),projectTemplate.pagesPath,moduleName);
    codeTools.createDirectoryEx(pageModulePath);
};

