'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.matches = matches;
exports.parse = parse;
exports.transform = transform;
exports.wrap = wrap;
exports.riki = riki;

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var CONTENT = '___content___';

var transforms = {
  js: function js(src) {
    return '\n' + src;
  },
  render: function render(src, content) {
    return '\n;' + content + '.push(' + src + ');';
  }
};

function matches(src, regex) {
  var results = [];
  var match = regex.exec(src);
  while (match !== null) {
    results.push(match);
    match = regex.exec(src);
  }
  return results;
}

function parse(str) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return matches(str, options.regex || /\n:([a-zA-Z0-9]*):\n/img).map(function (val, i, arr) {
    return {
      type: val[1].toLowerCase(),
      content: str.substring(val.index + val[0].length, i < arr.length - 1 ? arr[i + 1].index : str.length)
    };
  });
}

function transform(arr) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var xform = function xform(type) {
    return transforms[type] || (options.transforms || {})[type];
  };
  return ';var ' + CONTENT + ' = [];' + arr.map(function (block) {
    return xform(block.type)(block.content, CONTENT);
  }).join('\n');
}

function wrap(src) {
  return '(function(){' + src + (';return ' + CONTENT + ';})');
}

function riki(src) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var transformed = wrap(options.transpile(transform(parse('\n' + src, options), options)));
  return _extends({
    raw: transformed
  }, options.raw ? {} : {
    content: _vm2['default'].runInContext(transformed, _vm2['default'].createContext(options.locals || {}))
  });
}