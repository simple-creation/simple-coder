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

module.exports = async (args) => {
    const projectName = args[0];
    const { templateName } = await Inquirer.prompt({
        name: 'templateName',
        type: 'list',
        message: 'please choice template to create project',
        choices: templates,
    });

    const template = templates.find(item => item.name === templateName);
    if (!template.url) {
        console.log(chalk.red('downloading fatal：该模版正在开发中...'));
        return false;
    };

    const result =  await fetchTemplateCode(template,projectName);
    if (!result){
        return false;
    } 
    const configData = await obtainProjectInfo(template,projectName);
    console.log('final choice data-->', configData);
    setupProjectInfo(template,projectName,configData);
    return true;
    //await prepareFrameworks();
    //templateName === 'init-web-admin' ? inBaseInfo(templateName, projectName) : init(templateName, projectName);
   
};

// 从远程下载项目模版
const fetchTemplateCode = async (template, projectName) => {
   
    const tempProjectRootPath = path.join(process.cwd(),projectName);
    if (fs.existsSync(tempProjectRootPath)) {
        console.log('***WARNING!*** Target directory is existed! please remove old directory or change other one! ');
        return false;
    }
    let removeTempProject = 'rm -rf ' + tempProjectRootPath;
    executeTools.executeCommand(removeTempProject,'clean old project files');

    
    const loading = ora('downloading ...');// 设置loading效果

    loading.start();// 开始loading
    try {
        const data = await download(template.url, tempProjectRootPath,{clone:true});
        loading.succeed('downloading success');// 结束loading

        const projectGitPath = path.join(tempProjectRootPath,".git");
        let removeGitFiles = 'rm -rf ' + projectGitPath;
        executeTools.executeCommand(removeGitFiles,'clean git files');
        return true;
       
    } catch (error) {
        loading.fail('downloading fatal：'); // 结束loading 
        console.log(error);
        return false;
    };

    

};
// 从远程下载项目模版
const init = async (templateName, projectName, str) => {
    const template = templates.find(item => item.name === templateName);
    if (!template.url) {
        return console.log(chalk.red('downloading fatal：该模版正在开发中...'));
    };

    const loading = ora('downloading ...');// 设置loading效果

    loading.start();// 开始loading
    try {
        const data = await download(template.url, projectName);
        copyUIComponentsAndCleanGit(template,projectName);
        loading.succeed('downloading success');// 结束loading
        console.log('')
        console.log('You can :');
        console.log(`   cd ${projectName}`);
        console.log('   npm install');
        console.log('   npm run dev');
        console.log('to start your project');
        console.log('')
    } catch (error) {
        loading.fail('downloading fatal：'); // 结束loading 
        //console.log(chalk.red(error.statusMessage));
        console.log(error);
    };
};



const setupProjectInfo = async (template, projectName,config) => {
    
    console.log(template);
    if (template.name =='service:spring-boot'){
        
        let replaceMap = {};
        replaceMap["service-java-template"] = projectName;
        replaceMap["service-java-template-api"] = projectName + "-api";
        replaceMap["java-service"] = projectName;
        
        const targetServicePOMfile = path.join(process.cwd(),projectName,"service/pom.xml");
        const targetApiPOMfile = path.join(process.cwd(),projectName,"api/pom.xml");
        const targetParentPOMfile = path.join(process.cwd(),projectName,"pom.xml");
        const targetDronefile = path.join(process.cwd(),projectName,".drone.yml");
        const targetApplicationConfigfile = path.join(process.cwd(),projectName,"service/src/main/resources/application.yml");
        codeTools.replaceFileContent(targetServicePOMfile,replaceMap);
        codeTools.replaceFileContent(targetApiPOMfile,replaceMap);
        codeTools.replaceFileContent(targetParentPOMfile,replaceMap);

        codeTools.replaceFileContent(targetApplicationConfigfile,replaceMap);
        codeTools.replaceFileContent(targetDronefile,replaceMap);
    }

}

// 添加基本信息
const obtainProjectInfo = async (templateName, projectName) => {
    return Inquirer.prompt([
        {
            type: "input",
            message: "Entry your project's name:",
            name: "name",
            default: projectName
        },
        // {
        //     type: "confirm",
        //     message: "Choice your project's private:",
        //     name: "private",
        //     default: false
        // },
    ]).then(data => {
        return data;
    });
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
// 通过模版内容写文件
const renderFile = (templateName, projectName, data) => {
    const filename = path.join(__dirname, `./../templates/${templateName}/package.json`);

    ejs.renderFile(filename, data, {}, function (err, str) {
        if (err) return console.log(chalk.red('ejs ERROR :', err));
        init(templateName, projectName, str);
    });
}

const  downloadFrameworkByTemplate = async (templateDefault)=>{
    const USER_HOME = process.env.HOME || process.env.USERPROFILE
    const frameworkRootPath = path.join(USER_HOME,".framework",templateDefault.name);
    const frameworkResult = await download(templateDefault.url,frameworkRootPath);
    return frameworkResult;
}
const  prepareFrameworks = async () =>{
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    const frameworkRootPath = path.join(USER_HOME,".framework","simple-framework");
    if (fs.existsSync(frameworkRootPath)){
        return false;
    }
    frameworkTemplates.map(async(template)=>{
        await downloadFrameworkByTemplate(template);
    });
}
const copyUIComponentsAndCleanGit = (projectTemplate,projectName)=>{
    const projectGitPath = path.join(process.cwd(),projectName,".git");
    let removeGitFiles = 'rm -rf ' + projectGitPath;
    executeTools.executeCommand(removeGitFiles,'clean git files');
    if (projectTemplate.name ==='service:spring-boot'){
        return;
    }
    const frameworkTemplate = frameworkTemplates.find(item => item.name === projectTemplate.frameworkName);
    
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    const frameworkUIComponentsPath = path.join(USER_HOME,".framework",frameworkTemplate.name, frameworkTemplate.componentSrcPath);
    const projectUIComponentsPath = path.join(process.cwd(),projectName,projectTemplate.pagesPath, "components");
    codeTools.copyDirEx(frameworkUIComponentsPath,projectUIComponentsPath);
}

