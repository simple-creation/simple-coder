#! /usr/bin/env node
const path = require('path');
const commander = require('commander');
const { version } = require('./package.json');
const simpleCoder = require('./simple-coder');

console.log('Input pramas:',process.argv.slice(1));

const supportApplications = simpleCoder.getSupportApplications();
const tempPath = simpleCoder.getTempWorkPath('tempZip');
console.log('support application list->', supportApplications);
console.log('temp zipfile path', tempPath);
const testMain = async()=>{

    const configData = {
        templateName:'server:spring-boot',
        name:'test-server',
        appId: '100001',
   }
   //await simpleCoder.createProject(configData);
   
   configData.templateName = 'web:nextjs';
   await simpleCoder.createProject(configData);

   configData.templateName = 'mini-program:taro';
   await simpleCoder.createProject(configData);

}
testMain();










