const Inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const { promisify } = require('util');
const downloadGitRepo = require('download-git-repo');
const download = promisify(downloadGitRepo);
const { templates,frameworkTemplates } = require('./const.js');
const ejs = require('ejs');

const codeTools = require('./code-tools');
var { executeCommand,openUrl } = require('./execute-tool');

const WEB_SERVER_ENTRY = path.join(__dirname, "../web/server/server.js");;



module.exports = async (pageName, moduleName) => {
    if (!moduleName) {
        moduleName = "demo";
    }

    const projectConfig = codeTools.getConfig();
    if (!projectConfig) {
        console.log('unknow project type! exited !')
        return;
    }

    console.log('project config', projectConfig.frameworkName)
    
    const frameworkTemplate = frameworkTemplates.find((item) => item.name === projectConfig.frameworkName);
    console.log('framework', frameworkTemplate);

    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    const frameworkUICreatorWebPath = path.join(USER_HOME,".framework",frameworkTemplate.name, frameworkTemplate.webPath);
  
    const webCommand = 'MODULE=' + moduleName + ' PAGE=' + pageName + ' WEBPATH=' + frameworkUICreatorWebPath + ' node ' + WEB_SERVER_ENTRY;
    openUrl('http://localhost:3000/');
    executeCommand(webCommand, "startup web-server");
    

};


