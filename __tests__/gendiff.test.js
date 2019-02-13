import fs from 'fs';
import genDiff from '../src';

test('genDiff with JSON step2', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expected_step2', 'utf-8');
  const received = genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json');
  expect(received).toEqual(expected);
});

test('genDiff with JML step3', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expected_step2', 'utf-8');
  const received = genDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml');
  expect(received).toEqual(expected);
});
