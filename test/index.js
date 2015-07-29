/* global describe, it */
require('chai').should();
import React from 'react';
import {parse, transform, riki} from '../src';
import {markdown} from 'markdown';
import * as babel from 'babel';

const transpile = src => babel.transform(src, {stage: 0}).code;

function log(level='log'){
  console[level](this);
  return this;
}

describe('riki', () => {
  describe('parse', () => {
    it('should be able to parse basic input, and return an array of blocks', ()=>{
      let src = `
:js:
var x = 123;
var y = require('name');

:render:
\`whatever you may say\`
`;
      parse(src).should.eql([
        { type: 'js', content: 'var x = 123;\nvar y = require(\'name\');\n' },
        { type: 'render', content: '`whatever you may say`\n' } ]);


    });
  });
  describe('transform', () => {
    it('should be able to apply custom transforms', ()=>{
      let src = `
:js:
var x = 123;
:md:
I *love* [the glitch mob](http://www.theglitchmob.com/)
`;
      const transforms = {
        md(text, content){
          return `;${content}.push(<div dangerouslySetInnerHTML={{__html: ${JSON.stringify(markdown.toHTML(text))}}}/>);`;
        }
      };
      transform(parse(src), {transforms}).should.eql(';var ___content___ = [];\nvar x = 123;\n;___content___.push(<div dangerouslySetInnerHTML={{__html: \"<p>I <em>love</em> <a href=\\\"http://www.theglitchmob.com/\\\">the glitch mob</a></p>\"}}/>);');
    });

  });
  describe('eval', () => {
    it('should produce an expression, that evaluates to an array of content blocks', () => {
      let src = `
:js:
let x = 123;
:render:
<div>{x}</div>`;

      React.renderToStaticMarkup(riki(src, {transpile, locals: {React}}).content()[0]).should.eql('<div>123</div>');
    });
  });
});
