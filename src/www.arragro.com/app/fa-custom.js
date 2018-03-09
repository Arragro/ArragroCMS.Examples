/*!
 * Font Awesome Pro 5.0.6 by @fontawesome - http://fontawesome.com
 * License - http://fontawesome.com/license (Commercial License)
 */
(function () {
'use strict';

var _WINDOW = {};
try {
  if (typeof window !== 'undefined') _WINDOW = window;
  
} catch (e) {}

var _ref = _WINDOW.navigator || {};
var _ref$userAgent = _ref.userAgent;
var userAgent = _ref$userAgent === undefined ? '' : _ref$userAgent;

var WINDOW = _WINDOW;





var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';







var PRODUCTION = function () {
  try {
    return "production" === 'production';
  } catch (e) {
    return false;
  }
}();

var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);



var RESERVED_CLASSES = ['xs', 'sm', 'lg', 'fw', 'ul', 'li', 'border', 'pull-left', 'pull-right', 'spin', 'pulse', 'rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 'stack', 'stack-1x', 'stack-2x', 'inverse', 'layers', 'layers-text', 'layers-counter'].concat(oneToTen.map(function (n) {
  return n + 'x';
})).concat(oneToTwenty.map(function (n) {
  return 'w-' + n;
}));

function bunker(fn) {
  try {
    fn();
  } catch (e) {
    if (!PRODUCTION) {
      throw e;
    }
  }
}

var w = WINDOW || {};

if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];

var namespace = w[NAMESPACE_IDENTIFIER];

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function define(prefix, icons) {
  var normalized = Object.keys(icons).reduce(function (acc, iconName) {
    var icon = icons[iconName];
    var expanded = !!icon.icon;

    if (expanded) {
      acc[icon.iconName] = icon.icon;
    } else {
      acc[iconName] = icon;
    }
    return acc;
  }, {});

  if (typeof namespace.hooks.addPack === 'function') {
    namespace.hooks.addPack(prefix, normalized);
  } else {
    namespace.styles[prefix] = _extends({}, namespace.styles[prefix] || {}, normalized);
  }

  /**
   * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
   * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
   * for `fas` so we'll easy the upgrade process for our users by automatically defining
   * this as well.
   */
  if (prefix === 'fas') {
    define('fa', icons);
  }
}

var icons = {
  "envelope": [512, 512, [], "f0e0", "M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"],
  "phone": [512, 512, [], "f095", "M493.397 24.615l-104-23.997c-11.314-2.611-22.879 3.252-27.456 13.931l-48 111.997a24 24 0 0 0 6.862 28.029l60.617 49.596c-35.973 76.675-98.938 140.508-177.249 177.248l-49.596-60.616a24 24 0 0 0-28.029-6.862l-111.997 48C3.873 366.516-1.994 378.08.618 389.397l23.997 104C27.109 504.204 36.748 512 48 512c256.087 0 464-207.532 464-464 0-11.176-7.714-20.873-18.603-23.385z"],
  "circle": [512, 512, [], "f111", "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"]
};

bunker(function () {
  define('fas', icons);
});

icons = {
  "microsoft": [448, 512, [], "f3ca", "M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"]
};

bunker(function () {
    define('fab', icons);
});

icons = {
    "code": [576, 512, [], "f121", "M228.5 511.8l-25-7.1c-3.2-.9-5-4.2-4.1-7.4L340.1 4.4c.9-3.2 4.2-5 7.4-4.1l25 7.1c3.2.9 5 4.2 4.1 7.4L235.9 507.6c-.9 3.2-4.3 5.1-7.4 4.2zm-75.6-125.3l18.5-20.9c1.9-2.1 1.6-5.3-.5-7.1L49.9 256l121-102.5c2.1-1.8 2.4-5 .5-7.1l-18.5-20.9c-1.8-2.1-5-2.3-7.1-.4L1.7 252.3c-2.3 2-2.3 5.5 0 7.5L145.8 387c2.1 1.8 5.3 1.6 7.1-.5zm277.3.4l144.1-127.2c2.3-2 2.3-5.5 0-7.5L430.2 125.1c-2.1-1.8-5.2-1.6-7.1.4l-18.5 20.9c-1.9 2.1-1.6 5.3.5 7.1l121 102.5-121 102.5c-2.1 1.8-2.4 5-.5 7.1l18.5 20.9c1.8 2.1 5 2.3 7.1.4z"],
    "lightbulb": [384, 512, [], "f0eb", "M192 80c0 8.837-7.164 16-16 16-35.29 0-64 28.71-64 64 0 8.837-7.164 16-16 16s-16-7.163-16-16c0-52.935 43.065-96 96-96 8.836 0 16 7.163 16 16zm176 96c0 101.731-51.697 91.541-90.516 192.674a23.722 23.722 0 0 1-5.484 8.369V464h-.018a23.99 23.99 0 0 1-5.241 14.574l-19.535 24.419A24 24 0 0 1 228.465 512h-72.93a24 24 0 0 1-18.741-9.007l-19.535-24.419A23.983 23.983 0 0 1 112.018 464H112v-86.997a24.153 24.153 0 0 1-5.54-8.478c-38.977-101.401-90.897-90.757-90.457-193.822C16.415 78.01 95.306 0 192 0c97.195 0 176 78.803 176 176zM240 448h-96v12.775L159.38 480h65.24L240 460.775V448zm0-64h-96v32h96v-32zm96-208c0-79.59-64.424-144-144-144-79.59 0-144 64.423-144 144 0 87.475 44.144 70.908 86.347 176h115.306C291.779 247.101 336 263.222 336 176z"],
    "cloud": [640, 512, [], "f0c2", "M272 64c60.28 0 111.899 37.044 133.36 89.604C419.97 137.862 440.829 128 464 128c44.183 0 80 35.817 80 80 0 18.55-6.331 35.612-16.927 49.181C572.931 264.413 608 304.109 608 352c0 53.019-42.981 96-96 96H144c-61.856 0-112-50.144-112-112 0-56.77 42.24-103.669 97.004-110.998A145.47 145.47 0 0 1 128 208c0-79.529 64.471-144 144-144m0-32c-94.444 0-171.749 74.49-175.83 168.157C39.171 220.236 0 274.272 0 336c0 79.583 64.404 144 144 144h368c70.74 0 128-57.249 128-128 0-46.976-25.815-90.781-68.262-113.208C574.558 228.898 576 218.571 576 208c0-61.898-50.092-112-112-112-16.734 0-32.898 3.631-47.981 10.785C384.386 61.786 331.688 32 272 32z"],
    "dollar-sign": [256, 512, [], "f155", "M215.016 270.738c-20.645-16.106-47.199-26.623-72.879-36.793-52.27-20.701-84.007-35.924-84.007-72.7 0-14.775 6.838-28.551 19.256-38.79 14.224-11.729 34.232-17.928 57.862-17.928 44.17 0 74.063 28.044 74.332 28.3a12 12 0 0 0 18.455-2.164l12.348-19.327a12.002 12.002 0 0 0-1.484-14.801c-1.316-1.362-30.896-31.36-84.135-37.163V12c0-6.628-5.373-12-12-12H119.68c-6.627 0-12 5.372-12 12v48.628c-26.917 4.68-50.079 15.699-67.459 32.187-19.506 18.503-30.249 42.997-30.249 68.968 0 31.566 12.416 56.747 37.956 76.979 21.247 16.832 48.384 27.789 74.628 38.386 50.536 20.404 81.22 35.216 81.22 68.775 0 36.556-29.504 62.086-71.749 62.086-55.769 0-91.023-37.421-91.539-37.976-2.298-2.511-5.551-3.945-8.958-3.899a12.003 12.003 0 0 0-8.909 4.078L7.052 387.928a12.001 12.001 0 0 0-.031 15.808c1.538 1.764 36.52 41.1 100.659 49.193V500c0 6.628 5.373 12 12 12h23.084c6.627 0 12-5.372 12-12v-47.312c27.167-4.216 50.427-15.711 67.75-33.589 18.972-19.579 29.42-45.947 29.42-74.249 0-30.488-12.076-54.73-36.918-74.112z"],
    "chevron-circle-down": [512, 512, [], "f13a", "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216zm-207.5 86.6l115-115.1c4.7-4.7 4.7-12.3 0-17l-7.1-7.1c-4.7-4.7-12.3-4.7-17 0L256 303l-99.5-99.5c-4.7-4.7-12.3-4.7-17 0l-7.1 7.1c-4.7 4.7-4.7 12.3 0 17l115 115.1c4.8 4.6 12.4 4.6 17.1-.1z"],
    "spinner-third": [512, 512, [], "f3f4", "M460.115 373.846l-6.941-4.008c-5.546-3.202-7.564-10.177-4.661-15.886 32.971-64.838 31.167-142.731-5.415-205.954-36.504-63.356-103.118-103.876-175.8-107.701C260.952 39.963 256 34.676 256 28.321v-8.012c0-6.904 5.808-12.337 12.703-11.982 83.552 4.306 160.157 50.861 202.106 123.67 42.069 72.703 44.083 162.322 6.034 236.838-3.14 6.149-10.75 8.462-16.728 5.011z"]
};

bunker(function () {
    define('fal', icons);
});

}());
