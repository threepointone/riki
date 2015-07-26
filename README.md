riki
---

(work in progress)

`npm install riki --save`

Would you like to write your blogposts/README/articles like this?

```js
:js:
  import React from 'react';
  import {Spring} from 'react-motion'
  import {State} from 'react-state';

  let box = {
    width: 40,
    height:40,
    backgroundColor: 'red'
  }

:md:
  *Welcome* to the [react-motion](https://github.com/chenglou/react-motion/) playground!

:render:
  <State initial={{top:0, left:0}}>{ (state, set) =>
    <Spring endValue={state}>{ value =>
      <div style={{flex:1}} onMouseMove={e => set({top: e.pageY, x: e.pageX})}>
        <div style={{...value, ...box}}>move it move it</div>
      </div>
    }</Spring>
  }</State>
```

  And then render it to html/native?

  With riki, anything is possible.

  [demo - live editor](threepointone.github.io/riki/examples/simple)

```js
riki(src, options); // returns {raw: String, content: function -> Array}
```
example
```js
let src = `
:js:
  let user = {id: 'threepointone', name: 'Sunil Pai'};
:render:
  <div> Hello {user.name}! </div>
`;

let content = riki(src, {
  locals: {
    React: require('React')
  },
  transpile: code => babel.transform(code, {stage: 0}).code
}).content();

// gives [<div> Hello Sunil Pai!</div>], an array of react elements

React.renderToStaticMarkup(content[0]);
// "<div> Hello Sunil Pai!</div>"

```

options
---
- `locals`: map of locally available references when evaluating. These include stuff like `React`, `require` (needed if you're using `import`), etc
- `transforms`: map of transforms for different 'types'. `js`, and `render` are included by default, so this is where you can pass transforms for markdown, jade, etc
- `regex`: regular expression to detect `:(type):` separators (defaults to `/\n:([a-zA-Z0-9]*):\n/img`)
- `transpile`: function to transform generated javascript before evaluating. use this to pass through babel, etc.

tests
---
`npm test`

