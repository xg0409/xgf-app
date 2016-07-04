// calculate the offset() of specific node related document.
(function () {

  function isWindow(obj) {
    return obj != null && obj === obj.window;
  };

  function offset(elem) {
    var docElem, win,
      box = {
        top: 0,
        left: 0
      },
      doc = elem && elem.ownerDocument;

    if (!doc) {
      return;
    }

    docElem = doc.documentElement;

    // Support: BlackBerry 5, iOS 3 (original iPhone)
    // If we don't have gBCR, just use 0,0 rather than error
    if (typeof elem.getBoundingClientRect !== "undefined") {
      box = elem.getBoundingClientRect();
    }

    function getWindow(elem) {
      return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    };
    win = getWindow(doc);

    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  };

  function getStyles(elem) {
    // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
    // IE throws on elements created in popups
    // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    if (elem.ownerDocument.defaultView.opener) {
      return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
    }

    return window.getComputedStyle(elem, null);
  };

  function accessProperty(elem, propName) {
    var doc;
    elem = elem || window;

    console.log("dom.accessProperty->", propName);

    if (isWindow(elem)) {
      // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
      // isn't a whole lot we can do. See pull request at this URL for discussion:
      // https://github.com/jquery/jquery/pull/764
      return elem.document.documentElement["client" + propName];
    }

    // Get document width or height
    if (elem.nodeType === 9) {
      doc = elem.documentElement;

      // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
      // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
      return Math.max(
        elem.body["scroll" + propName], doc["scroll" + propName],
        elem.body["offset" + propName], doc["offset" + propName],
        doc["client" + propName]
      );
    }
    // Get width or height on the element, requesting but not forcing parseFloat
    return parseInt(getStyles(elem)[propName.toLowerCase()]) || 0;
  };
  window.dom = {
    getWidth: function (elem) {
      return accessProperty(elem, "Width");
    },
    getHeight: function (elem) {
      return accessProperty(elem, "Height");
    },
    offset: offset
  }
})();
