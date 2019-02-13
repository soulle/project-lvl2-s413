#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';

const toObject = pathToFile => parse(fs.readFileSync(pathToFile, 'utf-8'), path.extname(pathToFile));

export default (pathToBefore, pathToAfter) => {
  const objBefore = toObject(pathToBefore);
  const objAfter = toObject(pathToAfter);
  const keys = _.union(_.keys(objBefore), _.keys(objAfter));
  const func = (key) => {
    if (_.has(objBefore, key) && _.has(objAfter, key)) {
      if (objBefore[key] === objAfter[key]) {
        return `    ${key}: ${objAfter[key]}`;
      }
      return `  + ${key}: ${objAfter[key]}\n  - ${key}: ${objBefore[key]}`;
    }
    if (!_.has(objBefore, key) && _.has(objAfter, key)) {
      return `  + ${key}: ${objAfter[key]}`;
    }
    return `  - ${key}: ${objBefore[key]}`;
  };
  const result = ['{', ...keys.map(func), '}'].join('\n');
  return result;
};
