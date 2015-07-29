import 'babel/polyfill';
// var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');

// ReactCompositeComponent.Mixin._renderValidatedComponentWithoutOwnerOrContext = function(){
//   var inst = this._instance;
//   var renderedComponent;
//   try{
//     renderedComponent = inst.render();
//   }
//   catch(e){
//     console.error(e);
//     renderedComponent = null;
//   }

//   if ("production" !== process.env.NODE_ENV) {
//     // We allow auto-mocks to proceed as if they're returning null.
//     if (typeof renderedComponent === 'undefined' &&
//         inst.render._isMockFunction) {
//       // This is probably bad practice. Consider warning here and
//       // deprecating this convenience.
//       renderedComponent = null;
//     }
//   }

//   return renderedComponent;
// };


import React from 'react';



import {App} from './app';

React.render(
  <App />,
  document.getElementById('root')
);

