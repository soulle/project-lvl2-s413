#!/usr/bin/env node
import fs from 'fs';
import _ from 'lodash';

const toObject = pathToFile => JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));

export default (pathToBefore, pathToAfter) => {
  const objBefore = toObject(pathToBefore);
  const objAfter = toObject(pathToAfter);
  const keys = _.union(_.keys(objBefore), _.keys(objAfter));
  const func = (key) => {
    if (_.has(objBefore, key) && _.has(objAfter, key)) {
      if (objBefore[key] === objAfter[key]) {
        return [`    ${key}: ${objAfter[key]}`];
      }
      return [`  + ${key}: ${objAfter[key]}\n  - ${key}: ${objBefore[key]}`];
    }
    if (!_.has(objBefore, key) && _.has(objAfter, key)) {
      return [`  + ${key}: ${objAfter[key]}`];
    }
    if (_.has(objBefore, key) && !_.has(objAfter, key)) {
      return [`  - ${key}: ${objBefore[key]}`];
    }
    return [`${key} is undefined`];
  };
  const result = ['{', ...keys.map(func), '}'].join('\n');
  return result;
};
