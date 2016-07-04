/**
 * <div class="iscroll-wrapper" iscroll scroll-height="0" scroll-context=".popup-rule-container" scroll-excluded=".testing" iscroll-instance="scrollInstance">
 * scroll-excluded=".testing .other"
 * Note: default we also support #j_footerbar, #j_headerbar.
 * @author tianyingchun
 */
app.directive("scrollHeight", ['$parse', '$rootScope', '$timeout', '$log', '$window', function ($parse, $rootScope, $timeout, $log, $window) {
  return {
    restrict: 'A',
    link: function (scope, $el, attrs) {
      var cfg = {
        timeout: 100
      };
      var offsetExp = scope.$eval(attrs.scrollHeight);
      // offset height.
      var offsetHeight = offsetExp ? parseInt(offsetExp) : 0;

      // give the scroll-height context container.
      var scrollContext = attrs.scrollContext || null;

      var excludedSelectors = (attrs.scrollExcluded || '').split(/\s+/);

      // before compatible.
      excludedSelectors.unshift('#j_footerbar', '#j_headerbar');

      if (isNaN(offsetHeight)) {
        offsetHeight = 0;
      }
      var w = angular.element($window);

      // try to get context scroll container if not give window as the parent.
      var contextContainer = null;
      var dimensions = calculateDimension();

      // capture dialog opened event.
      // if current dialog without iscroller ignore it. performance optimization.
      scope.$on('ngDialog.opened', function (event, dialogContext) {
        var dialogElement = dialogContext[0];
        var iScrollHeightEl = dialogElement.querySelector("[scroll-height]");
        var iScrollEl = dialogElement.querySelector("[iscroll]");

        // make sure current dialog has iscroll & iscroll-height directive.
        var hasIsrollHeight = iScrollEl && iScrollHeightEl || false;
        if (hasIsrollHeight) {
          contextContainer = scrollContext && (dialogContext[0] || document).querySelector(scrollContext) || null;
          dimensions = calculateDimension();
          updateContainerStyle(dimensions);
        }
      });

      scope.getWindowDimensions = function () {
        return angular.toJson(dimensions);
      };

      // view content loaded.
      $rootScope.$on('$viewContentLoaded', function () {
        $log.debug("$viewContentLoaded");
        updateContainerStyle(dimensions);
      });

      scope.$on("scrollHeight.refresh", function () {
        $log.debug("scrollHeight.refresh");
        updateContainerStyle(dimensions);
      });

      scope.$watch(scope.getWindowDimensions, function (demension, oldValue) {
        // resize Grid to optimize height
        updateContainerStyle(angular.fromJson(demension));
      }, true);

      w.bind('resize', function () {

        dimensions = calculateDimension();

        $log.debug("dimensions:", dimensions);
        // delay 200 ms to re-calculate window dom demension.
        $timeout(function () {
          scope.$apply();
        }, 200);
      });
      // destroy unbind resize event.
      scope.$on('$destroy', function () {
        w.unbind('resize');
      });

      function calculateDimension() {
        return {
          'h': $window.dom.getHeight(contextContainer),
          'w': $window.dom.getWidth(contextContainer)
        };
      }

      function fixFrequencyUpdateDom() {
        var timeoutId = $el.data("timeoutid");
        if (timeoutId) {
          $timeout.cancel(timeoutId);
          $el.data("timeoutid", 0);
        }
      };

      function updateChildMinHeight(minHeight) {
        var scrollWrapper = $el.children()[0];
        scrollWrapper.style.minHeight = (minHeight + 2) + "px";
      }

      // update container style.
      function updateContainerStyle(demension) {
        fixFrequencyUpdateDom();
        // save timeout id.
        $el.data("timeoutid", $timeout(function () {
          var w = demension.w,
            h = demension.h;
          $log.debug("updateContainerStyle:", demension);

          var excludedContainerHeight = 0;
          excludedSelectors.forEach(function (item) {
            var domObj = item && document.querySelector(item) || null;
            var domObjHeight = domObj ? $window.dom.getHeight(domObj) : 0;
            excludedContainerHeight = excludedContainerHeight + domObjHeight;
          });

          var newScrollContainerHeight = (h - excludedContainerHeight + offsetHeight);

          if (h) $el.css("height", newScrollContainerHeight + "px");

          updateChildMinHeight(newScrollContainerHeight);

          // if (w) $el.css("width", w + "px");
          //
          // ----------------------------------------------------
          // send signal to notify refresh iscroll
          // Note: it will broadcast to all scroll intenace,  we must broadcast to current scroll instance.
          // get current iscrollInstance of element hooked using `iscroll-height`;
          var iscrollInstance = $el.data('iscrollInstance') || null;

          iscrollInstance && iscrollInstance.refresh();

        }, cfg.timeout));
      };
    }
  };
}]);
