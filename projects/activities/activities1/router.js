(function() {
  // var debugModel = window.AjsH5.debugModel;
  //
  // configuring our routes
  // ----------------------------------------------------------------------------------------------------
  app.config(['$httpProvider', "$stateProvider", "$urlRouterProvider", "$logProvider", "$sceDelegateProvider",
    function($httpProvider, $stateProvider, $urlRouterProvider, $logProvider, $sceDelegateProvider) {

      // allow cross cookie, it seems that we need to set withCredentials in global for all $http request.
      // we can't use $http(config) pass parameter "withCredentials", maybe there is bug existed in angularjs 1.3.8
      // $httpProvider.defaults.withCredentials = true;
      // sce resource white list.
      $sceDelegateProvider.resourceUrlWhitelist(['self', 'http*://**']);
      // default is true
      // $logProvider.debugEnabled(debugModel);
      $stateProvider
        .state('demo', {
          url: '/demo',
          controller: 'IndexCtrl',
          templateUrl: '/views/demo1.html'
        })
        .state('demo2', {
          url: '/demo2',
          controller: 'IndexCtrl',
          templateUrl: '/views/demo2.html'
        });

      $urlRouterProvider.otherwise('/demo');
    }
  ]);
})();
