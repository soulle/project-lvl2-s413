#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';

const toObject = pathToFile => parse(fs.readFileSync(pathToFile, 'utf-8'), path.extname(pathToFile));
const isObj = value => value instanceof Object;
const stringify = (data) => {
  const result = Object.keys(data).map(key => `${key}: ${data[key]}`);
  return ['{', ...result, '  }'].join('\n');
};
const toString = data => (data instanceof Object ? stringify(data) : data);

const build = (before, after) => {
  const keys = _.union(_.keys(before), _.keys(after));
  return keys.map((key) => {
    const valueBefore = before[key];
    const valueAfter = after[key];
    if (_.has(before, key) && _.has(after, key)) {
      if (!isObj(valueBefore) || !isObj(valueAfter)) {
        if (valueBefore === valueAfter) {
          return { key, value: valueAfter, state: 'unchanged' };
        }
        return { key, value: [valueBefore, valueAfter], state: 'changed' };
      }
      const children = build(valueBefore, valueAfter);
      return { key, children, type: 'tree' };
    }
    if (_.has(before, key) && !_.has(after, key)) {
      return { key, value: valueBefore, state: 'deleted' };
    }
    return { key, value: valueAfter, state: 'added' };
  });
};

const buildAst = (pathToBefore, pathToAfter) => {
  const objBefore = toObject(pathToBefore);
  const objAfter = toObject(pathToAfter);
  return build(objBefore, objAfter);
};

const states = {
  unchanged: obj => `    ${obj.key}: ${toString(obj.value)}`,
  changed: obj => [`  + ${obj.key}: ${toString(obj.value[1])}`,
    `  - ${obj.key}: ${toString(obj.value[0])}`],
  deleted: obj => `  - ${obj.key}: ${toString(obj.value)}`,
  added: obj => `  + ${obj.key}: ${toString(obj.value)}`,
};

const render = (ast) => {
  console.log('AST', ast);

  // const iter = (depth = 0) {
  //  }
  const result = ast.map((obj) => {
    if (obj.type !== 'tree') {
      return states[obj.state](obj);
    }
    return [`  ${obj.key}: ${render(obj.children)}`];
  });
  const flatten = _.flatten(result);
  return ['{', ...flatten, '}'].join('\n');
};

export default (pathToBefore, pathToAfter) => render(buildAst(pathToBefore, pathToAfter));
