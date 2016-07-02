var projectsInfo = require('./projectsInfo.js');
function initPromptConfig() {
  var projectsConfig = projectsInfo.projects;
  var questions = [];

  var projectConfig = {
    config: 'project_item',
    type: 'list',
    message: 'Which project would you like to build ?',
    choices: []
  };

  Object.keys(projectsConfig).forEach(function (projectName) {
    projectConfig.choices.push({
      name: projectName,
      value: projectName
    })
  });

  questions.push(projectConfig);

  Object.keys(projectsConfig).forEach(function (projectName) {
    var submoduleObject = {
      config: "submodule_item",
      type: 'list',
      message: 'select ' + projectName + ' project submodule',
      when: function (answers) {
        var answer = answers['project_item'];
        return answer === projectName;
      },
      choices: []
    };

    submoduleObject.choices.push({
        value: 'build_all_submodules',
        name: '====== build_all_'+projectName+" ======"
    });

    Object.keys(projectsConfig[projectName]).forEach(function (submodule) {
      if (submodule == "_metaInfo")return;
      submoduleObject.choices.push({
        name: submodule,
        value: submodule
      });
    });
    questions.push(submoduleObject);

  });

  // Object.keys(projectsConfig).forEach(function (projectName) {
  //   var submoduleObject = {
  //     config: "build_all_judge",
  //     type: 'Judge',
  //     message: 'build all project?(yes/no)',
  //     when: function (answers) {
  //       var answer = answers['submodule_item'];
  //       return answer === 'build_all_submodules';
  //     }
  //   };
  //
  //   questions.push(submoduleObject);
  // });

  var submoduleObject = {
    config: "build_all_judge",
    type: 'Judge',
    message: 'build all project?(yes/no)',
    when: function (answers) {
      var answer = answers['submodule_item'];
      return answer === 'build_all_submodules';
    }
  };

  questions.push(submoduleObject);

  return {
    questions: questions
  };

}

module.exports = initPromptConfig();