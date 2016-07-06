app.directive('onFinishRenderFilters', function ($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      console.log(111)
      if (scope.$last === true) {
        $timeout(function() {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  };
});