import fs from 'fs';
import genDiff from '../src';

describe('gendiff tree format', () => {
  const expectedResult = fs.readFileSync('__tests__/__fixtures__/expected_step5', 'utf-8');
  const actual0 = genDiff('tree', '__tests__/__fixtures__/recursion_files/before.json', '__tests__/__fixtures__/recursion_files/after.json');
  const actual1 = genDiff('tree', '__tests__/__fixtures__/recursion_files/before.yml', '__tests__/__fixtures__/recursion_files/after.yml');
  const actual2 = genDiff('tree', '__tests__/__fixtures__/recursion_files/before.ini', '__tests__/__fixtures__/recursion_files/after.ini');
  test.each([[actual0, expectedResult], [actual1, expectedResult], [actual2, expectedResult]])(
    'genDiff %#',
    (actual, expected) => expect(actual).toEqual(expected),
  );
});

test('gendiff plain format', () => {
  const expectedResult = fs.readFileSync('__tests__/__fixtures__/expected_step6', 'utf-8');
  const received = genDiff('plain', '__tests__/__fixtures__/recursion_files/before.json', '__tests__/__fixtures__/recursion_files/after.json');
  expect(received).toEqual(expectedResult);
});
