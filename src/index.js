import * as babel from 'babel-core/browser';
import vm from 'vm';

export function * matches(src, regex) {
  let match = regex.exec(src);
  while (match !== null) {
    yield match;
    match = regex.exec(src);
  }
}

export function parse (str, {regex}) {
  return [for (x of matches(str, regex || /\n:([a-zA-Z0-9]*):\n/img)) x]
    .map((val, i, arr) => ({
      type: val[1].toLowerCase(),
      content: str.substring(val.index + val[0].length, (i < arr.length - 1) ? arr[i + 1].index : str.length)
    }));
}

export function transform(arr, options) {
  let transforms = {
    js(src) {
      return src;
    },
    render(src) {
      return `;___content___.push(${src});`;
    },
    ...(options.transforms || {})
  };

  return `;var React = require('react');var ___content___ = [];` + arr.map(block => transforms[block.type](block.content)).join('');
}

export function wrap(src) {
  return ';(function(){' + src + ';return ___content___;})();';
}

export function riki(src, options){
  let transformed = wrap(babel.transform(transform(parse('\n' + src, options), options), {stage: 0}).code);
  if(options.raw){
    return transformed;
  }
  return vm.runInContext(transformed, vm.createContext(options));
}
