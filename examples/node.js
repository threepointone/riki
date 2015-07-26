import React from 'react';
import {State} from 'react-state';
import {Spring} from 'react-motion';
import {riki} from '../src';
import * as babel from 'babel';

let initial = `
:js:
  import React from 'react';
  import {State} from 'react-state';
  import {Spring} from 'react-motion';

  let box = {
    width: 100,
    height: 100,
    backgroundColor: 'red'
  };

:render:
<State initial={0}>{ (state, set) =>
  <Spring endValue={{left: {val: state}}}>{ value =>
    <div onClick={e => set(state === 0 ?  100 :  0)} style={{left: value.left.val, ...box}}>
      move it move it
    </div>
  }</Spring>
}</State>
`;

let modules = {
  react: React,
  'react-state': {State},
  'react-motion': {Spring}
};

const locals = {
  require(module){
    if(modules[module]){
      return modules[module];
    }
    throw new Error(`module '${module}' not found`);
  }
};


const transpile = src => babel.transform(src, {stage: 0}).code;

let html = riki(initial, {
  locals,
  transpile
}).map(React.renderToString);

console.log(html);



