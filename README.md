riki
---

(work in progress)

`npm install babel markdown riki --save`

Would you like to write your blogposts/README/articles like this?

```
:js:
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
  <State initial={{top:0, left:0}}>{
    (state, set) => <Spring endValue={state}>{
      value => <div style={{flex:1}} onMouseMove={ e=> set({top: e.pageY, x: e.pageX})}>
        <div style={{…value, ...box}}>move it move it</div>
      </div>
    }</Spring>
  }</State>
  ```

  And then have it render automatically to html/native?

  With riki, anything is possible.

```js
riki(src, options); // returns an array of react components
```

