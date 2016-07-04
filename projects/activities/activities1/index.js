
// The project name 'finance-activities'
// Export global varible `app`; it's pre reserved keyword.
window.app = angular.module('activities_activities1', [
  'ui.router'
]);

// if (typeof FastClick === 'function') {
//   app.run(function() {
//     FastClick.attach(document.body);
//   });
// }

require('../../../shared/lib_angular/core');

// share book controller
require('./controller');

require('./stylesheet');

require('./router');

// share book view.
require('./views');

