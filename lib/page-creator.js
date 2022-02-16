
const path = require('path');
const fs = require('fs');
const codeTools = require('./code-tools');

module.exports = async (params, pageName,moduleName) => {
    if (!moduleName){
        moduleName = 'demo';
    }
    if(!pageName){
        pageName = '.index.js';
    }


    const projectTemplate = codeTools.getConfig();
    if(!projectTemplate){
        console.log('unknow project framework type! exited !')
        return;
    }
    if (projectTemplate.name === 'service:spring-boot'){
        console.log("this project don't support UI");
        return;
    }
 
    //项目类型。
    let templateRootPath = path.join(__dirname,"../templates",projectTemplate.templateRootPath);
    let templateFile = path.join(templateRootPath,'page.jsx');
    

    //代码写入位置：
    const pagesPath = projectTemplate.pagesPath;
    let outputFilename = pageName + '.jsx';
   

    let outputPath = path.join(process.cwd(),pagesPath,moduleName);
    codeTools.createDirectoryEx(outputPath);
    let outputFile =  path.join(outputPath, outputFilename);
   
   
    //写入目标文件
    console.log('params===>',params);
    //let blockArray = '';
    params.blocks.map((item)=>{
        item.componentImportPath = "import "+ item.name + ` from '../components/` + item.sourcecodePath + `'`;
        item.styleImportPath = 'import  "../components/' + item.sourcecodePath + '/style"';
        item.dataName = codeTools.firstLower(item.name) + 'Data';
    });
    codeTools.generateCode(templateFile, {blocks:params.blocks},outputFile);

    if (projectTemplate.name==='mini-program'){
        let pageConfigTemplateFile = path.join(templateRootPath,'page.config.js');

        let pageConfigOutputFile =  path.join(outputPath,  pageName + '.config.js');
        codeTools.generateCode(pageConfigTemplateFile, {blocks:params.blocks},pageConfigOutputFile);
    }
    
};

