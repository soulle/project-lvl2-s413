import fs from 'fs';
import genDiff from '../src';

describe('gendiff tree format', () => {
  const expectedResult = fs.readFileSync('__tests__/__fixtures__/expected_step5', 'utf-8');
  const extensions = ['.json', '.yml', '.ini'];
  test.each(extensions)(
    'genDiff %#',
    (ext) => {
      const actual = genDiff(`__tests__/__fixtures__/recursion_files/before${ext}`, `__tests__/__fixtures__/recursion_files/after${ext}`, 'tree');
      expect(actual).toEqual(expectedResult);
    },
  );
});

describe('gendiff plain format', () => {
  const expectedResult = fs.readFileSync('__tests__/__fixtures__/expected_step6', 'utf-8');
  const extensions = ['.json', '.yml', '.ini'];
  test.each(extensions)(
    'genDiff %#',
    (ext) => {
      const actual = genDiff(`__tests__/__fixtures__/recursion_files/before${ext}`, `__tests__/__fixtures__/recursion_files/after${ext}`, 'plain');
      expect(actual).toEqual(expectedResult);
    },
  );
});
