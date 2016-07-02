var buildConfig = require('../../build.config.js');
var _ = require('lodash');
var path = require('path');
var cwd = process.cwd();
var util = require('./util.js');

var defaultConfig = {
    devServer: {
        host: 'localhost',
        port: 3000,
        publicPath: 'http://localhost:3000/public/'
    }
};

function prepareConfiguration() {

    var optionsConfig = buildConfig.options || {};
    var projectsConfig = buildConfig.projects || {};

    _.extend(defaultConfig, optionsConfig);

    Object.keys(projectsConfig).forEach(function(projectName){
        var projectLocalDir = path.join(cwd,optionsConfig.projectRoot,projectName);
        if(!util.isDir(projectLocalDir)){
            console.log('The project `' + projectName + '` found in ./build.config.js but not real existed in' + projectLocalDir);
            delete projectsConfig[projectName];
            return;
        }
        console.log(projectName);
    });

    return {
        options:optionsConfig,
        projects:projectsConfig
    }

}


module.exports = prepareConfiguration();
