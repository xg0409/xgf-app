
app.controller('IndexCtrl', ['$scope', '$state', function ($scope, $state) {
  $scope.name = "XG";


  $scope.$on('$viewContentLoaded', function () {
    console.log("$viewContentLoaded")
  });
  
  $scope.$on("ngRepeatFinished",function(){
    console.log("xg:",$scope.demoIscrollInstance);
    if($scope.demoIscrollInstance){
      $scope.demoIscrollInstance.refresh();
    }
  });
  
  $scope.btn = function () {
    var items = []
    for (var i = 0; i < 100; i++) {
      items.push({
        name: 'XG' + i
      })
    }
    $scope.items = items;
  };


}]);
