/**
 * Created by zhangyq on 2016/5/1.
 */

var path = require('path');
var fs       = require('fs');

function copyDir(src, dest){
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    var srcPath = src + "/";
    var destPath = dest + "/";
    var files = fs.readdirSync(srcPath);
    files.forEach(function(file){
        var filePath =srcPath + file;
        var stats = fs.statSync(filePath);
        if (!stats.isDirectory()){
            var source = fs.readFileSync(filePath, 'utf-8');
            fs.writeFileSync(destPath + file,source,'utf-8');
        }
    });
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
//create directory sync
function createDirectory(dirName){
    console.log("------------begin to create directory:" + dirName);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
        console.log("------------successful to create directory:" + dirName);
    }
}

function mkdirsSyncX(dirpath, mode) {
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
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
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

exports.copyDirEx = copyDirEx;
exports.copyDir = copyDir;
exports.mkdirX = mkdirsSyncX;
exports.createDirectory = createDirectory;
exports.javaPackageToPath = javaPackageToPath;
