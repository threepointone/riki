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

export function * matches(src, regex) {
  let match = regex.exec(src);
  while (match !== null) {
    yield match;
    match = regex.exec(src);
  }
}

export function parse (str, options={}) {
  return [for (x of matches(str, options.regex || /\n:([a-zA-Z0-9]*):\n/img)) x]
    .map((val, i, arr) => ({
      type: val[1].toLowerCase(),
      content: str.substring(val.index + val[0].length, (i < arr.length - 1) ? arr[i + 1].index : str.length)
    }));
}

export function transform(arr, options={}) {
  let t = {...transforms, ...(options.transforms || {})};
  return `;var ${CONTENT} = [];` + arr.map(block => t[block.type](block.content, `${CONTENT}`)).join('\n');
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
