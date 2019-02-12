import fs from 'fs';
import genDiff from '../src';

test('genDiff(pathToFile1, pathToFile2) is equal expected_step2', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expected_step2', 'utf-8');
  const received = genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json');
  expect(received).toEqual(expected);
});
