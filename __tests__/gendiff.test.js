import fs from 'fs';
import genDiff from '../src';

describe('gendiff from flat files', () => {
  const expectedResult = fs.readFileSync('__tests__/__fixtures__/expected_step2', 'utf-8');
  const actual0 = genDiff('__tests__/__fixtures__/flat_files/before.json', '__tests__/__fixtures__/flat_files/after.json');
  const actual1 = genDiff('__tests__/__fixtures__/flat_files/before.yml', '__tests__/__fixtures__/flat_files/after.yml');
  const actual2 = genDiff('__tests__/__fixtures__/flat_files/before.ini', '__tests__/__fixtures__/flat_files/after.ini');
  test.each([[actual0, expectedResult], [actual1, expectedResult], [actual2, expectedResult]])(
    'genDiff %#',
    (actual, expected) => expect(actual).toEqual(expected),
  );
});

describe('gendiff from recursion files', () => {
  const expectedResult = fs.readFileSync('__tests__/__fixtures__/expected_step5', 'utf-8');
  const actual0 = genDiff('__tests__/__fixtures__/recursion_files/before.json', '__tests__/__fixtures__/recursion_files/after.json');
  const actual1 = genDiff('__tests__/__fixtures__/recursion_files/before.yml', '__tests__/__fixtures__/recursion_files/after.yml');
  const actual2 = genDiff('__tests__/__fixtures__/recursion_files/before.ini', '__tests__/__fixtures__/recursion_files/after.ini');
  test.each([[actual0, expectedResult], [actual1, expectedResult], [actual2, expectedResult]])(
    'genDiff %#',
    (actual, expected) => expect(actual).toEqual(expected),
  );
});
