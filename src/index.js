import vm from 'vm';

let CONTENT = '___content___';

let transforms = {
  js(src) {
    return src;
  },
  render(src, content) {
    return `;${content}.push(${src});`;
  }
};

export function matches(src, regex) {
  let results = [];
  let match = regex.exec(src);
  while (match !== null) {
    results.push(match);
    match = regex.exec(src);
  }
  return results;
}

export function parse (str, options={}) {
  return matches(str, options.regex || /\n:([a-zA-Z0-9]*):\n/img)
    .map((val, i, arr) => ({
      type: val[1].toLowerCase(),
      content: str.substring(val.index + val[0].length, (i < arr.length - 1) ? arr[i + 1].index : str.length)
    }));
}

export function transform(arr, options={}) {
  let xform = type => transforms[type] || (options.transforms || {})[type];
  return `;var ${CONTENT} = [];` + arr.map(block => xform(block.type)(block.content, `${CONTENT}`)).join('\n');
}

export function wrap(src) {
  return `;(function(){` + src + `;return ${CONTENT};});`;
}

export function riki(src, options = {}){
  let transformed = wrap(options.transpile(transform(parse('\n' + src, options), options)));
  return {
    raw: transformed,
    ...(options.raw ? {} : {
      content: vm.runInContext(transformed, vm.createContext(options.locals || {}))
    })
  };
}
