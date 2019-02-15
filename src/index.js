#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';
import plainRenderer from './renderers/plainRenderer';
import treeRenderer from './renderers/treeRenderer';

const formats = {
  tree: treeRenderer,
  plain: plainRenderer,
};

const toObject = pathToFile => parse(fs.readFileSync(pathToFile, 'utf-8'), path.extname(pathToFile));

const build = (before, after) => {
  const keys = _.union(_.keys(before), _.keys(after));
  return keys.map((key) => {
    const valueBefore = before[key];
    const valueAfter = after[key];
    if (_.has(before, key) && _.has(after, key)) {
      if (!_.isObject(valueBefore) || !_.isObject(valueAfter)) {
        if (valueBefore === valueAfter) {
          return { key, value: valueAfter, type: 'unchanged' };
        }
        return { key, value: [valueBefore, valueAfter], type: 'updated' };
      }
      const children = build(valueBefore, valueAfter);
      return { key, children, type: 'tree' };
    }
    if (_.has(before, key) && !_.has(after, key)) {
      return { key, value: valueBefore, type: 'removed' };
    }
    return { key, value: valueAfter, type: 'added' };
  });
};

const buildAst = (pathToBefore, pathToAfter) => {
  const objBefore = toObject(pathToBefore);
  const objAfter = toObject(pathToAfter);
  return build(objBefore, objAfter);
};

export default (type = 'tree', pathToBefore, pathToAfter) => {
  const ast = buildAst(pathToBefore, pathToAfter);
  return formats[type](ast);
};
