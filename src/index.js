#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';

const toObject = pathToFile => parse(fs.readFileSync(pathToFile, 'utf-8'), path.extname(pathToFile));
const isObj = value => value instanceof Object;
const stringify = (data, d) => {
  const result = Object.keys(data).map(key => `        ${'    '.repeat(d)}${key}: ${data[key]}`);
  return ['{', ...result, `    ${'    '.repeat(d)}}`].join('\n');
};
const toString = (data, d) => (data instanceof Object ? stringify(data, d) : data);

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
  unchanged: (obj, d) => `    ${'    '.repeat(d)}${obj.key}: ${toString(obj.value, d)}`,
  changed: (obj, d) => [`  ${'    '.repeat(d)}+ ${obj.key}: ${toString(obj.value[1], d)}`,
    `  ${'    '.repeat(d)}- ${obj.key}: ${toString(obj.value[0], d)}`],
  deleted: (obj, d) => `  ${'    '.repeat(d)}- ${obj.key}: ${toString(obj.value, d)}`,
  added: (obj, d) => `  ${'    '.repeat(d)}+ ${obj.key}: ${toString(obj.value, d)}`,
};

const render = (ast) => {
  const iter = (arr, depth, acc) => {
    if (arr.length === 0) {
      return acc;
    }
    const [current, ...rest] = arr;
    if (current.children !== undefined) {
      const children = _.flatten(iter(current.children, depth + 1, []));
      const newAcc = [...acc, `    ${'    '.repeat(depth)}${current.key}: ${['{', ...children, `    ${'    '.repeat(depth)}}`].join('\n')}`];
      return iter(rest, depth, newAcc);
    }
    const newAcc = [...acc, states[current.state](current, depth)];
    return iter(rest, depth, newAcc);
  };
  const result = iter(ast, 0, []);
  const flatten = _.flatten(result);
  return ['{', ...flatten, '}'].join('\n');
};

export default (pathToBefore, pathToAfter) => render(buildAst(pathToBefore, pathToAfter));
