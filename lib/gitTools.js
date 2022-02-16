/**
 * Created by zhangyq on 2016/5/1.
 */

var path = require('path');
var fs = require('fs');
const simpleGit = require('simple-git');
const { resolve } = require('path');

const options = {
    baseDir: process.cwd(),
    maxConcurrentProcesses: 6,
};
const git = simpleGit(options);
function getCodeByBranch(path, branch) {
    return new Promise((resolve, reject) => {
        git.clone(path).then(() => {
            resolve()
        }).catch(err => {
            console.log(err);
            reject(err)
        })
    })
}
function clone(src, dest) {

}

exports.clone = clone;
// exports.pull = pull;
exports.getCodeByBranch = getCodeByBranch;
