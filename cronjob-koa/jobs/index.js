/**
 * Created by sunharuka on 15/10/10.
 */
var CronJob = require('cron').CronJob;
var cp = require('child_process');
var path = require('path');
var fs = require('fs');
var jobRootPath = path.resolve(__dirname,'./');
/**
 * 检索任务
 * @returns {*}
 */
var scanJobs = function*() {
  "use strict";
  var scanner = new Promise(function (resolve, reject) {
    "use strict";
    fs.readdir(jobRootPath, function (err, list) {
      if (err) return reject(err);
      let jobs = [];
      let pending = list.length;
      list.forEach(function (file) {
        let filePath = path.resolve(jobRootPath,file);
        fs.stat(filePath, function (err, stats) {
          if (err) return reject(err);
          if (stats && stats.isDirectory()) {
            try{
              let jobDetail = require(path.resolve(filePath,'profile'));
              jobDetail.path = file;
              jobs.push(jobDetail);
            }catch(ex){
              console.log(ex);
              return;
            }
          }
          if (!--pending) return resolve(jobs);
        });
      });
    });
  });
  return yield scanner.then(function (list) {
    return list;
  });
};

/**
 * 执行脚本
 * @param options
 * @returns {Function}
 */
var onJobStart = function(options){
  "use strict";
  return function(){
    let scriptPath = path.resolve(jobRootPath,options.path, options.script);
    var p = cp.spawn(scriptPath, [], {stdio:'pipe'});
    p.on('error', function(err){

    });
    p.on('close', function (code) {

    });
    p.stdout.on('data', function (data) {
      console.log(data.toString());
    });
    p.stderr.on('data', function (data) {
      console.log(data.toString());
    });
  };
};

var onJobDone = function(){
  "use strict";
  return function(){

  };
};

var defineJob = function(job) {
  "use strict";
  if(!job){
    return false;
  }
  /*
   * * * * * *
   Seconds: 0-59
   Minutes: 0-59
   Hours: 0-23
   Day of Month: 1-31
   Months: 0-11
   Day of Week: 0-6
   */
  var cronTime = job.schedule;
  var timezone = job.timezone;

  try {
    let _j = new CronJob(cronTime, onJobStart({script: job.script,path:job.path}), onJobDone({script: job.script,path:job.path}), true, timezone);
  } catch (e) {
    //logger.error('Error create cron', script, e);
  }

};

var initJobs = function *(){
  "use strict";
  let jobs = yield scanJobs();
  jobs.forEach(function(job){
      defineJob(job);
  });
};

initJobs();

exports.scanJobs = scanJobs;
exports.initJobs = initJobs;
