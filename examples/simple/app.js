import React, { Component } from 'react';
import {markdown} from 'markdown';
import {State} from 'react-state';
import {Spring} from 'react-motion';
import { riki } from '../../src';


let initial = `
:js:
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


let modules = {
  react: React,
  markdown,
  'react-state': {State},
  'react-motion': {Spring}
};

const styles = {
  wrap: {
    flexDirection: 'row',
    display: 'flex',
    flex: 1
  },
  input: {
    flex: 1
  },
  textarea: {
    flex: 1,
    fontFamily: 'monospace'
  },
  preview: {
    flex: 1
  }
};

export class App extends Component {
  state = {
    input: initial
  }
  preview(src){
    try{
      return riki(src, {
        require(module) {
          if(modules[module]){
            return modules[module];
          }
          throw new Error(`module '${module}' not found`);
        },
        transforms: {
          md(text){
            return `;___content___.push(<div dangerouslySetInnerHTML={{__html: ${JSON.stringify(markdown.toHTML(text))}}}/>);`;
          }
        }
      });
    }
    catch(e){
      console.error(e.message);
    }
  }
  render() {
    return <div style={styles.wrap}>
      <div style={styles.input}>
        <textarea style={styles.textarea} value={this.state.input} onChange={e => this.setState({input: e.target.value})} />
      </div>
      <div style={styles.preview}>{this.preview(this.state.input)}</div>
    </div>;
  }
}

