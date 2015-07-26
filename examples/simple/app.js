/* global babel */
import React, { Component } from 'react';
import {markdown} from 'markdown';
import {State} from 'react-state';
import {Spring} from 'react-motion';
import {riki} from '../../src';
import Ace from './ace';

import qs from 'querystring';

// import * as babel from 'babel-core/browser';

let modules = {
  react: React,
  markdown: markdown,
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

const transforms = {
  md(text, content){
    return `;${content}.push(<div dangerouslySetInnerHTML={{__html: ${JSON.stringify(markdown.toHTML(text))}}}/>);`;
  }
};

const transpile = src => babel.transform(src, {stage: 0}).code;

const preview = src => {
  try{
    let result = riki(src, {
      locals,
      transforms,
      transpile
    });

    return {
      input: src,
      preview: result.content(),
      error: null
    };
  }
  catch(err){
    console.error(err);
    return {
      input: src,
      error: err
    };
  }
};

const styles = {
  wrap: {
    flexDirection: 'row',
    display: 'flex',
    flex: 1,
    overflow: 'auto',
    padding: 20,
    backgroundColor: '#ccc'
  },
  input: {
    flex: 1
  },
  textarea: {
    flex: 1,
    marginRight: 20

    // fontFamily: 'monospace',
    // padding: 20
  },
  error: {
    backgroundColor: 'red',
    color: 'white'
  },
  preview: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: 'white'
  }
};

export class App extends Component {
  state = preview(initial)
  onChange = value => {
    let frame = preview(value);
    this.setState(frame);
    if(!frame.error){
      window.history.replaceState({}, 'riki', window.location.pathname + '?' + qs.stringify({src: value}));
    }

  }
  render() {
    return <div style={styles.wrap}>
      <div style={styles.input}>
        <Ace name='TEXTAREA' value={this.state.input} onChange={this.onChange} theme="github" style={styles.textarea} />
        {this.state.error ? <div style={styles.error}>{this.state.error.message}</div> : null}
      </div>
      <div style={styles.preview}>{this.state.preview}</div>
    </div>;
  }
}

var frame;

try{

  if(window.location.search){
    frame = qs.parse(window.location.search.slice(1)).src;
  }
}
catch(e){
  console.error(e);
}

let initial = frame || `
:js:
  import React from 'react';
  import {State} from 'react-state';
  import {Spring} from 'react-motion';

  let box = {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    cursor: 'pointer'
  };

:render:
<State initial={0}>{ (state, set) =>
  <Spring endValue={{left: {val: state}}}>{ value =>
    <div onClick={e => set(state === 0 ?  100 :  0)} style={{left: value.left.val, ...box}}>
      move it move it
    </div>
  }</Spring>
}</State>

:md:
An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and 'monospace'. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

`;

// <textarea style={styles.textarea} value={this.state.input} onChange={this.onChange} />

