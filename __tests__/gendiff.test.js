import fs from 'fs';
import genDiff from '../src';

const expectedResult = fs.readFileSync('__tests__/__fixtures__/expected_step2', 'utf-8');
const actual0 = genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json');
const actual1 = genDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml');
const actual2 = genDiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini');
test.each([[actual0, expectedResult], [actual1, expectedResult], [actual2, expectedResult]])(
  'genDiff %#',
  (actual, expected) => expect(actual).toEqual(expected),
);
