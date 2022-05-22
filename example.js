#! /usr/bin/env node
const path = require('path');
const commander = require('commander');
const { version } = require('./package.json');
const simpleCoder = require('./simple-coder');

console.log('Input pramas:',process.argv.slice(1));

const supportApplications = simpleCoder.getSupportApplications();

console.log('support application list->', supportApplications);

const configData = {
     templateName:'server:spring-boot',
     name:'test-server',
     appId: '100001',
}
simpleCoder.createProject(configData);








