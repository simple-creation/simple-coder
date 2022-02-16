/**
 * Created by zhangyq on 2016/5/1.
 */

var path = require('path');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');

var db = {};


function opendb(dbPath){
    if (!dbPath) {dbPath="./"}
    var dbfile = path.join(dbPath,"db.json");
    console.log("-------database path directory:" + JSON.stringify(dbfile));
    db = low(dbfile);
    if (!db.has("Definedmodules").value()){
        db.defaults({
            "appName": "test",
            "modules":[],
            "channels": [],
            "Definedmodules": []
        }).value();
    }
}
function saveAppName(appName){
    db.set("appName",appName).value();
}
function getDefines(){

    var params = db.read().value();
    console.log("[defines]:" + JSON.stringify(params));
    return params;
}
function getModuleDefine(moduleName){

    var moduleDefine = db.get('Definedmodules')
        .find({ name: moduleName}).value();

    return moduleDefine;
}
function addModuleDefine(filename,mdefine){
      db.get("Definedmodules").push(mdefine).value();
      db.get("modules").push(mdefine.name).value();
      var channelName = mdefine.channel;
      var cItem = {};
      cItem.name =  mdefine.name;
      cItem.module =  mdefine.name;
      //findout the channel
      var channels = db.get("channels").value();
      var bFoundChannel = false;
      channels.forEach(function(item){
        if (item.name == channelName){
            bFoundChannel = true;
        }
      });
      if(bFoundChannel){
          db.get('channels')
              .find({ name: channelName }).get("children").push(cItem).value();
      }else{
          var channel = {};
          channel.name = channelName;
          channel.children = [];
          channel.children.push(cItem)
          db.get("channels").push(channel).value();
      }
}
function hasModule(module){
    var result = false;
    var modules = db.get("Definedmodules").value();
    modules.forEach(function(m){
        if (m.name == module){
            result = true;
            return result;
        }
    });
    return result;
}

exports.opendb = opendb;
exports.saveAppName = saveAppName;
exports.getDefines = getDefines;
exports.hasModule = hasModule;
exports.addModuleDefine = addModuleDefine;
exports.getModuleDefine = getModuleDefine;



