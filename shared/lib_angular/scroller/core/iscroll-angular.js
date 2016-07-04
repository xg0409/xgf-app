// https://github.com/tianyingchun/angular-iscroll
// dependancy iscroll.lite.js
// Note: we must using below dom structures.
//  <div class="iscroll-wrapper" iscroll scroll-height="0">
//     <div class="iscroll-scroller">
//         <div pull-to-refresh="onReload(data)">
//             <div class="list-group-item" ng-repeat="state in states" ng-bind="state"></div>
//         </div>
//     </div>
// </div>

// var IScroll = require('./iscroll-lite');
(function (IScroll) {
  'use strict';

  var signals = {
    disabled: 'iscroll:disabled',
    enabled: 'iscroll:enabled',
    refresh: 'iscroll:refresh'
  };

  // customized broadcast signals.
  var broadcastSignals = {
    scrollStart: 'iScroll:start',
    scrollTranslating: 'iScroll:translating',
    scrollEnd: 'iScroll:end',
    scrollCancel: 'iScroll:cancel'
  };

  var classes = {
    on: 'iscroll-on',
    off: 'iscroll-off'
  };

  function iScrollServiceProvider() {
    var defaultOptions = {
      iScroll: {
        /**
         * The different options for iScroll are explained in
         * detail at http://iscrolljs.com/#configuring
         **/
        momentum: true,
        mouseWheel: true,
        resizePolling: 300,
        // default open preventDefault.
        preventDefault: true,
        // if in mobile device disabled mouse, pointer touch event tracking.
        // disableMouse: !!!window.AjsH5.debugModel,
        // disablePointer: !!!window.AjsH5.debugModel,
        // Sometimes you want to preserve native vertical scroll but being able to add an horizontal iScroll (maybe a carousel). Set this to true and the iScroll area will react to horizontal swipes only. Vertical swipes will naturally scroll the whole page.
        eventPassthrough: "horizontal",
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/,
          fn: function (el) {
            if (el.attributes["ui-sref"] || el.attributes["clickable"]) {
              return true;
            }
            return false;
          }
        }
      },
      directive: {
        /**
         * Delay, in ms, before we asynchronously perform an
         * iScroll.refresh().  If false, then no async refresh is
         * performed.
         **/
        asyncRefreshDelay: 50,
        /**
         * Delay, in ms, between each iScroll.refresh().  If false,
         * then no periodic refresh is performed.
         **/
        refreshInterval: false
      }
    };

    function _configureDefaults(options) {
      angular.extend(defaultOptions, options);
    }

    this.configureDefaults = _configureDefaults;

    function _getDefaults() {
      return defaultOptions;
    }

    this.getDefaults = _getDefaults;

    /* @ngInject */
    function iScrollService($rootScope, $log, iScrollSignals) {
      var _state = {
        useIScroll: true
      };

      function _disable(signalOnly) {
        if (!signalOnly) {
          _state.useIScroll = false;
        }
        //$log.debug('emit(iScrollSignals.disabled)', iScrollSignals.disabled);
        $rootScope.$emit(iScrollSignals.disabled);
      }

      function _enable(signalOnly) {
        if (!signalOnly) {
          _state.useIScroll = true;
        }
        //$log.debug('emit(iScrollSignals.enabled)', iScrollSignals.enabled);
        $rootScope.$emit(iScrollSignals.enabled);
      }

      function _toggle(signalOnly) {
        (_state.useIScroll ^ signalOnly) ? // XOR
        _disable(signalOnly): _enable(signalOnly);
      }

      function _refresh(name) {
        // The name parameter is not really used for now.
        $rootScope.$emit(iScrollSignals.refresh, name);
      }

      return {
        defaults: defaultOptions,
        state: _state,
        enable: _enable,
        disable: _disable,
        toggle: _toggle,
        refresh: _refresh
      };
    }

    this.$get = ["$rootScope", "$log", "iScrollSignals", iScrollService];
  }

  function _call(functor) {
    functor();
  }

  /* @ngInject */
  function iscroll($rootScope, $timeout, $interval, $log, iScrollSignals,
    iScrollService) {
    function asyncRefresh(instance, options) {
      $timeout(function _refreshAfterInitialRender() {
        $log.debug("iscroll asyncRefreshDelay!");
        instance.refresh();
      }, options.directive.asyncRefreshDelay);
    }

    function _createInstance(scope, element, attrs, options) {
      var instance = new IScroll(element[0], options.iScroll),
        refreshEnabled = true,
        refreshInterval = null;

      element.removeClass(classes.off).addClass(classes.on);

      // use data api to store iscroll instance for other directives with the same node
      element.data('iscrollInstance', instance);

      if (angular.isDefined(attrs.iscrollInstance)) {
        scope.iscrollInstance = instance;
      }

      if (options.directive.asyncRefreshDelay !== false) {
        asyncRefresh(instance, options);
      }

      function _destroyInstance() {
        if (refreshInterval !== null) {
          $interval.cancel(refreshInterval);
        }

        // must remove iscroll instance that stored on directive element before $destroy().
        element.removeData('iscrollInstance');

        if (angular.isDefined(scope.iscrollInstance)) {
          delete scope.iscrollInstance;
        }
        instance.destroy();

        element.removeClass(classes.on).addClass(classes.off);
        // Remove element's CSS transition values:
        element.children('.iscroll-scroller').attr('style', null);

        angular.forEach(deregistrators, _call);
        $log.debug('angular-iscroll: destroyInstance');
      }

      function _refreshInstance(evt) {
        // $log.debug('angular-iscroll: refreshInstance', refreshEnabled);
        if (refreshEnabled) {
          refreshEnabled = false;
          asyncRefresh(instance, options);
          refreshEnabled = true;
        }
      }

      function _disableRefresh() {
        refreshEnabled = false;
      }

      function _enableRefresh() {
        refreshEnabled = true;
      }

      instance.on('scrollStart', function () {
        //iscroll-wrapper
        var scrollWrapperHeight = window.dom.getHeight(element[0]);
        var scrollContent = element.children()[0];
        var scrollContentHeight = window.dom.getHeight(scrollContent);
        if (scrollContent) {

        }
        var data = {
          wrapperHeight: scrollWrapperHeight,
          contentHeight: scrollContentHeight
        };
        // $log.debug("`iscroll-angular` scrollStart...", data);
        _disableRefresh();
        scope.$parent.$broadcast(broadcastSignals["scrollStart"], data);
      });

      // scroll translating  handler.
      instance.on('scrollTranslating', function (pos) {
        // $log.debug("`iscroll-angular` scrollTranslating:", pos);
        scope.$parent.$broadcast(broadcastSignals["scrollTranslating"], pos);
      });
      // scroll cancel event.
      instance.on('scrollCancel', function () {
        $log.debug("`iscroll-angular` scrollCancel...");
        scope.$parent.$broadcast(broadcastSignals["scrollCancel"]);
      });

      instance.on('scrollEnd', function () {
        $log.debug("`iscroll-angular` scrollEnd...");
        _enableRefresh();
        scope.$parent.$broadcast(broadcastSignals["scrollEnd"]);
      });

      if (options.directive.refreshInterval !== false) {
        refreshInterval = $interval(_refreshInstance,
          options.directive.refreshInterval);
      }

      var deregistrators = [
        $rootScope.$on(iScrollSignals.disabled, _destroyInstance),
        $rootScope.$on(iScrollSignals.refresh, _refreshInstance)
      ];
      scope.$on('$destroy', _destroyInstance)

      return instance;
    }

    function _link(scope, element, attrs) {
      var options = {
        iScroll: angular.extend({}, scope.iscroll || {},
          iScrollService.defaults.iScroll),
        directive: angular.extend({}, iScrollService.defaults.directive)
      };

      angular.forEach(options.iScroll,
        function _extractOptions(value, key) {
          if (iScrollService.defaults.directive.hasOwnProperty(key)) {
            options.directive[key] = value;
            delete options.iScroll[key];
          }
        }
      );

      function _init() {
        if (!element.hasClass(classes.on)) {
          _createInstance(scope, element, attrs, options);
        }
      }

      var enableHandlers = [$rootScope.$on(iScrollSignals.enabled, _init)];

      function _removeEnableHandlers() {
        angular.forEach(enableHandlers, _call);
      }

      if (iScrollService.state.useIScroll) {
        _init();
      } else {
        element.removeClass(classes.on).addClass(classes.off);
      }

      scope.$on('$destroy', _removeEnableHandlers);
    }

    return {
      restrict: 'A',
      link: _link,
      scope: {
        iscroll: '=',
        iscrollInstance: '='
      }
    }
  };

  return app
    .constant('iScrollSignals', signals)
    .provider('iScrollService', iScrollServiceProvider)
    .directive('iscroll', ["$rootScope", "$timeout", "$interval", "$log", "iScrollSignals", "iScrollService", iscroll]);

})(IScroll);
