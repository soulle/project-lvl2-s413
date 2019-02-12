#!/usr/bin/env node
import fs from 'fs';
import _ from 'lodash';

const toObject = pathToFile => JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));

export default (pathToBefore, pathToAfter) => {
  const objBefore = toObject(pathToBefore);
  const objAfter = toObject(pathToAfter);
  const unionObj = { ...objBefore, ...objAfter };
  const keys = Object.keys(unionObj);
  const reducer = (acc, key) => {
    if (!_.has(objBefore, key) && _.has(objAfter, key)) {
      return `${acc}\n  + ${key}: ${unionObj[key]}`;
    }
    if (_.has(objBefore, key) && !_.has(objAfter, key)) {
      return `${acc}\n  - ${key}: ${objBefore[key]}`;
    }
    if (_.has(objBefore, key) && _.has(objAfter, key)) {
      if (objBefore[key] === objAfter[key]) {
        return `${acc}\n    ${key}: ${unionObj[key]}`;
      }
      return `${acc}\n  + ${key}: ${objAfter[key]}\n  - ${key}: ${objBefore[key]}`;
    }
    return acc;
  };
  const result = keys.reduce(reducer, '{');
  return `${result}\n}`;
};
