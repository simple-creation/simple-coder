/**
 * Created by zhangyq on 2016/5/1.
 */

var path = require('path');
var ejsTool = require('ejs');
var fs       = require('fs');
const { templates, licenses } = require('./const.js');



function generateCode(templateFile, params, outFile){
    var temple = fs.readFileSync(templateFile, 'utf-8');
      var strResult = ejsTool.render(temple, {data: params});
     fs.writeFileSync(outFile,strResult,'utf-8');
}
function generateH5Code(templateFile, params, outFile){
    var temple = fs.readFileSync(templateFile, 'utf-8');
    var strResult = ejsTool.render(temple, {data: params},{delimiter: '?'});
    fs.writeFileSync(outFile,strResult,'utf-8');
}
//create directory sync
function createDirectory(dirName){
    console.log("------------begin to create directory:" + dirName);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
        console.log("------------successful to create directory:" + dirName);
    }
}

function createDirectoryEx(dirpath) {
    console.log("will be created path is:" + dirpath);
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                if (dirname ==''){
                    dirname =path.sep;
                }
                pathtmp = dirname;
            }

            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }
    return true;
}
function copyDirEx(src, dest){
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    var srcPath = src + "/";
    var destPath = dest + "/";
    var files = fs.readdirSync(srcPath);
    files.forEach(function(file){
        var srcPathFile =srcPath + file;
        var destPathFile = destPath + file;
        var stats = fs.statSync(srcPathFile);
        if (!stats.isDirectory()){
            var source = fs.readFileSync(srcPathFile, 'utf-8');
            fs.writeFileSync(destPathFile,source,'utf-8');
        }else{
            copyDirEx(srcPathFile,destPathFile);
        }
    });
}
function testInRightCoderPath(){
    var currentPath = process.cwd();
    var coderFilePath = currentPath + "/node_modules/simple-coder/coder.js";
    if (fs.existsSync(root)) {
       return true;
    }else{
        console.log('you should execute COMMAND:[simple-coder] in right project path! please check that before do a job!');
        return false;
    }
}

function firstUpper(input){
    var strTemp = "";
    for (var i =0; i <input.length; i++){
       if (i==0){
           strTemp += input[i].toUpperCase();
           continue;
       }
        strTemp += input[i];

    }
    return strTemp;
}

function firstLower(input){
    var strTemp = "";
    for (var i =0; i <input.length; i++){
       if (i==0){
           strTemp += input[i].toLowerCase();
           continue;
       }
        strTemp += input[i];

    }
    return strTemp;
}


function getConfig(){
    const filename = path.join(process.cwd(), '.framework.config.js');
    if(!fs.existsSync(filename)){
       console.log('Not found the framework config  file....');
       return undefined;
    }
    let config = require(filename);
    console.log('config ==>', config);

    const templateName = config.templateName;
    const template = templates.find(item => item.name === templateName);
    if (!template) {
        return console.log('fatal：该模版正在开发中...');
    };
    return template;
    
}

function javaPackageToPath(package) {
    if (package) {
        var pathtmp;
        package.split('.').forEach(function(item) {
            if (pathtmp) {
                pathtmp += item +"/" ;
            }
            else {

                pathtmp = '/' + item + '/';
            }

        });
        return pathtmp;
    }
    return "/";
}

exports.generateCode = generateCode;
exports.generateH5Code = generateH5Code;
exports.createDirectory = createDirectory;
exports.createDirectoryEx = createDirectoryEx;
exports.copyDirEx = copyDirEx;
exports.firstUpper = firstUpper;
exports.firstLower = firstLower;
exports.getConfig = getConfig;


