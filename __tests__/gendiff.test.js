import fs from 'fs';
import genDiff from '../src';

test('genDiff with flat files', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expected_step2', 'utf-8');
  const actualJson = genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json');
  expect(actualJson).toEqual(expected);
  const actualYaml = genDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml');
  expect(actualYaml).toEqual(expected);
});
