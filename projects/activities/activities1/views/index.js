angular.module('activities_activities1').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/views/demo1.html',
    "<div class=\"iscroll-wrapper\" iscroll scroll-height=\"0\" iscroll-instance=\"demoIscrollInstance\"><div class=\"iscroll-scroller\"><div ng-click=\"btn()\">iscroll</div><div>{{name}}</div><div ng-repeat=\"item in items\" on-finish-render-filters>{{item.name}}</div></div></div>"
  );


  $templateCache.put('/views/demo2.html',
    "<div>demo2223339992</div>"
  );

}]);
