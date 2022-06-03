#! /usr/bin/env node
const path = require('path');
const commander = require('commander');
const { version } = require('./package.json');
console.log('Input pramas:',process.argv.slice(3));
// 创建 init 命令
commander
    .command('create') // 命令的名称
    .alias('c') // 命令的别名
    .description('simple-coder create <project-name>, to create a new project') // 命令的描述
    .action(() => { // 动作
        if (process.argv.slice(3).length) {
            require(path.resolve(__dirname, './lib/create.js'))(process.argv.slice(3));
        } else {
            console.log('Please enter a project directory name, or Entry simple-coder --help');
        }
    });

    // 创建 AllInOne Projects
commander
.command('create-projects') // 命令的名称
.alias('c') // 命令的别名
.description('simple-coder create-project <project-name>, to create a new project') // 命令的描述
.action(() => { // 动作
    if (process.argv.slice(3).length) {
        require(path.resolve(__dirname, './lib/create-projects.js'))(process.argv.slice(3));
    } else {
        console.log('Please enter a project-name as directory name, or Entry simple-coder --help');
    }
});

// 创建 init 命令
commander
        .command('config') // 命令的名称
        .alias('s') // 命令的别名
        .description('simple-coder config <project-name>, to config a new project') // 命令的描述
        .action(() => { // 动作
                require(path.resolve(__dirname, './lib/setup.js')).setProjectConfig(process.argv.slice(3));
        });
// 创建新模块
commander
    .command('create-java-module') // 命令的名称
    .alias('server') // 命令的别名
    .description('simple-coder create-java-module  <package-name> <module-name>, to create a new java module') // 命令的描述
    .action(() => { // 动作
        
        if (process.argv.slice(3).length) {
            let packageName = process.argv[3]
            let moduleName = undefined;
            let targetName = undefined;
            
            if (process.argv.slice(4).length){
                moduleName = process.argv[4];
            }

            if (process.argv.slice(5).length){
                targetName = process.argv[5];
            }
            console.log("packageName:",packageName);
            console.log('moduleName:',moduleName)
            console.log("target Name:",targetName? targetName:'all');
            
            require(path.resolve(__dirname, './lib/generators/java-module-creator.js'))(packageName,moduleName,targetName);
        } else {
            console.log('Please enter a base package name, or Entry simple-coder --help');
        }
    });    

// 创建Web Admin后台新模块
commander
.command('create-admin-module') // 命令的名称
.alias('admin') // 命令的别名
.description('simple-coder create-admin-module  <application-name> <module-name>, to create a new module') // 命令的描述
.action(() => { // 动作
    
    if (process.argv.slice(3).length) {
        let applicationName = process.argv[3]
        let moduleName = undefined;
        let targetName = undefined;
        
        if (process.argv.slice(4).length){
            moduleName = process.argv[4];
        }

        if (process.argv.slice(5).length){
            targetName = process.argv[5];
        }
        console.log("applicationName:",applicationName);
        console.log('moduleName:',moduleName)
        console.log("target Name:",targetName? targetName:'all');
        
        require(path.resolve(__dirname, './lib/generators/admin-module-creator.js'))(applicationName,moduleName,targetName);
    } else {
        console.log('Please enter a base package name, or Entry simple-coder --help');
    }
});    

// 创建Web Admin后台新模块
commander
.command('create-mini-module') // 命令的名称
.alias('mini') // 命令的别名
.description('simple-coder create-mini-module  <application-name> <module-name>, to create a new module') // 命令的描述
.action(() => { // 动作
    
    if (process.argv.slice(3).length) {
        let applicationName = process.argv[3]
        let moduleName = undefined;
        let targetName = undefined;
        
        if (process.argv.slice(4).length){
            moduleName = process.argv[4];
        }

        if (process.argv.slice(5).length){
            targetName = process.argv[5];
        }
        console.log("applicationName:",applicationName);
        console.log('moduleName:',moduleName)
        console.log("targetClassName:",targetName);
        
        require(path.resolve(__dirname, './lib/generators/mini-module-creator.js'))(applicationName,moduleName,targetName);
    } else {
        console.log('Please enter a base package name, or Entry simple-coder --help');
    }
});    


// 创建新页面
commander
    .command('create-ui-page') // 命令的名称
    .alias('page') // 命令的别名
    .description('simple-coder create-ui-page <page-name> <module-name>, to create a new ui element') // 命令的描述
    .action(() => { // 动作

        if (process.argv.slice(3).length) {
            let pageName = process.argv[3]
            let moduleName =  process.argv[4]
            require(path.resolve(__dirname, './lib/web-runner.js'))(pageName,moduleName);
        } else {
            console.log('Please enter a page name, or Entry simple-coder --help');
        }
    });    

//升级框架
commander
    .command('upgrade') // 命令的名称
    .alias('c') // 命令的别名
    .description('simple-coder upgrade , upgrade the frameworks ') // 命令的描述
    .action(() => { // 动作
        require(path.resolve(__dirname, './lib/upgrade.js'))();
    });    
// 处理异常 command
commander
    .command('*') // 命令的名称
    .description('simple-coder create <project-name>, to create a new project') // 命令的描述
    .action(() => { // 动作
        console.log('Command not found, Entry simple-coder --help');
    });

//动态获取版本号
commander.version(version)
    .parse(process.argv);

