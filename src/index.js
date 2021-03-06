import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';
import render from './renderers';

const toObject = pathToFile => parse(fs.readFileSync(pathToFile, 'utf-8'), path.extname(pathToFile));

const nodeTypes = [
  {
    type: 'tree',
    check: (before, after, key) => (_.has(before, key) && _.has(after, key))
    && (_.isObject(before[key]) && _.isObject(after[key])),
    getValue: (before, after, key, func) => ({ children: func(before[key], after[key]) }),
  },
  {
    type: 'unchanged',
    check: (before, after, key) => (_.has(before, key) && _.has(after, key))
    && (!_.isObject(before[key]) || !_.isObject(after[key]))
    && (before[key] === after[key]),
    getValue: (before, after, key) => ({ value: after[key] }),
  },
  {
    type: 'updated',
    check: (before, after, key) => _.has(before, key) && _.has(after, key),
    getValue: (before, after, key) => ({ valueBefore: before[key], valueAfter: after[key] }),
  },
  {
    type: 'added',
    check: (before, after, key) => !_.has(before, key) && _.has(after, key),
    getValue: (before, after, key) => ({ value: after[key] }),
  },
  {
    type: 'removed',
    check: (before, after, key) => _.has(before, key) && !_.has(after, key),
    getValue: (before, after, key) => ({ value: before[key] }),
  },
];

const build = (before, after) => {
  const keys = _.union(_.keys(before), _.keys(after));
  return keys.map((key) => {
    const { type, getValue } = nodeTypes.find(({ check }) => check(before, after, key));
    const newKey = { key, ...getValue(before, after, key, build), type };
    return newKey;
  });
};

const buildAst = (pathToBefore, pathToAfter) => {
  const objBefore = toObject(pathToBefore);
  const objAfter = toObject(pathToAfter);
  return build(objBefore, objAfter);
};

export default (pathToBefore, pathToAfter, type = 'tree') => {
  const ast = buildAst(pathToBefore, pathToAfter);
  return render(ast, type);
};
