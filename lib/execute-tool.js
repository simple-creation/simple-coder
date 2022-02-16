/**
 * Created by Joezhang on 2019/11/21.
 */

/**
 * Created by Joezhang on 2018/11/21.
 */

require('shelljs/global');

//const {exec} = require("child_process");
function openUrl(url){
    let openCommand = `open ${url}`;
    switch (process.platform) {
        //mac系统使用 一下命令打开url在浏览器
        case "darwin":
            //exec(`open ${url}`);
            executeCommand(openCommand,'open url');
            break;
        //win系统使用 一下命令打开url在浏览器
        case "win32":
            //exec(`start ${url}`);
            openCommand =`start ${url}`;
            executeCommand(openCommand,'open url');
            break;
            // 默认mac系统
        default:
            //exec(`open ${url}`);
            executeCommand(openCommand,'open url');
    }

}





function executeCommand(command,commandTag){
    console.log('*************************************************************************');
    console.log('******************************executing ' + commandTag + ' command:[' + command + "]");
    console.log('*************************************************************************');
    let result = exec(command);
    if (result.code !== 0) {
        console.log(result.stderr);
        console.log('*********************failed to excute '+ commandTag + ' command:[' + command + ']');
        return false;
    }
    console.log('*************************************************************************');
    console.log('*********************************sucess to  excute ' + commandTag + ' command');
    console.log('*************************************************************************');
    return true;
}


function executeScripts(pathObj){
    console.log('*********************************begin to deploy k8s files !....******************************************');
    let result = true;
    let executeScripts = pathObj.executeScriptFiles();

    executeScripts.forEach(function(scriptFile){
        let grantPermissionCommand = "chmod +x " + scriptFile;
        let runScriptCommand = './' + scriptFile;
        
        if (!executeCommand(grantPermissionCommand,"grant the permission")){ result = false;}
        if(!executeCommand(runScriptCommand,"execute the script")){ result = false;}
    });
    console.log('*********************************finish to deploy config files !*****************************************');
    return result;
}




module.exports = {
    executeScripts: executeScripts,
    executeCommand:executeCommand,
    openUrl:openUrl,
    
}

