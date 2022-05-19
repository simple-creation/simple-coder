
const path = require('path');
const fs = require('fs');
const codeTools = require('./code-tools');

function createModuleFiles(targetRootPath,moduleDefine){
    console.log('create module[',moduleDefine.modelName,']......')
    let templateRootPath = path.join(__dirname,"../templates/server/java/module");
    //let packagePath = codeTools.javaPackageToPath(packageName);
    //let targetRootPath = path.join(process.cwd(),packagePath);

    //moduleDefine.packageName = packageName;
    moduleDefine.moduleClassName =  codeTools.firstUpper(moduleDefine.moduleName);
    moduleDefine.moduleName = codeTools.firstLower(moduleDefine.moduleName);
    moduleDefine.modelClassName = moduleDefine.modelName;
    moduleDefine.moduleDtoClassName = moduleDefine.moduleClassName + "Dto";

     //create module dao
     let targetPath = path.join(targetRootPath,"/dao");
     //codeTools.createDirectoryEx(targetPath);
     let templateFile = path.join(templateRootPath,"Dao.java"); 
     let targetFile = path.join(targetPath,moduleDefine.moduleClassName + "Repository.java");
     
     codeTools.generateCode(templateFile, moduleDefine,targetFile);

     //create module dto objects
     targetPath = path.join(targetRootPath,"/dto");
     //codeTools.createDirectoryEx(targetPath);
     //create dto
     templateFile = path.join(templateRootPath,"Dto.java");    
     targetFile = path.join(targetPath,moduleDefine.moduleClassName + "Dto.java");  
     codeTools.generateCode(templateFile, moduleDefine,targetFile);

     templateFile = path.join(templateRootPath,"DtoDetail.java");    
     targetFile = path.join(targetPath,moduleDefine.moduleClassName + "DetailDto.java");  
     codeTools.generateCode(templateFile, moduleDefine,targetFile);

    

     templateFile = path.join(templateRootPath,"DtoNew.java");    
     targetFile = path.join(targetPath,moduleDefine.moduleClassName + "NewDto.java");  
     codeTools.generateCode(templateFile, moduleDefine,targetFile);

     templateFile = path.join(templateRootPath,"DtoList.java");    
     targetFile = path.join(targetPath,moduleDefine.moduleClassName + "sDto.java");  
     codeTools.generateCode(templateFile, moduleDefine,targetFile);

     templateFile = path.join(templateRootPath,"DtoDetailList.java");    
     targetFile = path.join(targetPath,moduleDefine.moduleClassName + "DetailsDto.java");  
     codeTools.generateCode(templateFile, moduleDefine,targetFile);

     //create service
     templateFile = path.join(templateRootPath,"Service.java");   
     targetPath = path.join(targetRootPath,"/service"); 
     //codeTools.createDirectoryEx(targetPath);
     targetFile = path.join(targetPath,moduleDefine.moduleClassName + "Service.java");  
     codeTools.generateCode(templateFile, moduleDefine,targetFile);

     //create controller
     templateFile = path.join(templateRootPath,"Controller.java");   
     targetPath = path.join(targetRootPath,"/controller"); 
     //codeTools.createDirectoryEx(targetPath);
     targetFile = path.join(targetPath,moduleDefine.moduleClassName + "Controller.java");  
     codeTools.generateCode(templateFile, moduleDefine,targetFile);


}

module.exports = async (packageName,moduleName) => {
  
    let templateRootPath = path.join(__dirname,"../templates/server/java/module");

    let packagePath = codeTools.javaPackageToPath(packageName);
    let targetRootPath = path.join(process.cwd(),"src/main/java",packagePath);
    let targetModelPath = path.join(targetRootPath,"model");
    let moduleDefines= codeTools.getPathJavaFileText(targetModelPath);
    //console.log("templateRootPath-->",templateRootPath,"targetRootPath-->", targetRootPath, "targetModelPath-->", targetModelPath);
    targetPath = path.join(targetRootPath,"/controller"); 
    codeTools.createDirectoryEx(targetPath);

    targetPath = path.join(targetRootPath,"/service"); 
    codeTools.createDirectoryEx(targetPath);

    targetPath = path.join(targetRootPath,"/dao"); 
    codeTools.createDirectoryEx(targetPath);

    targetPath = path.join(targetRootPath,"/dto"); 
    codeTools.createDirectoryEx(targetPath);


    if(moduleName){
         let moduleDefine;
         moduleDefines.forEach(item=>{
             if(item.moduleName.toLowerCase() == moduleName.toLowerCase()){
                moduleDefine = item;
                console.log('found match module[',moduleName,'], continue to create module files...');
             }
         });
         if (moduleDefine){
            moduleDefine.packageName = packageName;
            createModuleFiles(targetRootPath,moduleDefine);
            console.log('Successful create module files!');
         }else{
            console.log('module not found!');
         }   
         return;
    }
    
    moduleDefines.forEach(moduleDefine=>{
        moduleDefine.packageName = packageName;
        createModuleFiles(targetRootPath,moduleDefine);
        
    });
    console.log('Successful create module files!');

}

