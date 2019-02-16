import fs from 'fs';
import genDiff from '../src';

describe('gendiff from tree and plain formats', () => {
  const expectedResultTree = fs.readFileSync('__tests__/__fixtures__/expected_step5', 'utf-8');
  const expectedResultPlain = fs.readFileSync('__tests__/__fixtures__/expected_step6', 'utf-8');
  const extensions = ['.json', '.yml', '.ini'];

  test.each(extensions)(
    'genDiff tree format %#',
    (ext) => {
      const actual = genDiff(`__tests__/__fixtures__/recursion_files/before${ext}`, `__tests__/__fixtures__/recursion_files/after${ext}`, 'tree');
      expect(actual).toEqual(expectedResultTree);
    },
  );

  test.each(extensions)(
    'genDiff plain format %#',
    (ext) => {
      const actual = genDiff(`__tests__/__fixtures__/recursion_files/before${ext}`, `__tests__/__fixtures__/recursion_files/after${ext}`, 'plain');
      expect(actual).toEqual(expectedResultPlain);
    },
  );
});

test('to json', () => {
  const actual = genDiff('__tests__/__fixtures__/recursion_files/before.json', '__tests__/__fixtures__/recursion_files/after.json', 'json');
  const expected = fs.readFileSync('__tests__/__fixtures__/expected_step7.json', 'utf-8');
  expect(actual).toEqual(expected);
});
