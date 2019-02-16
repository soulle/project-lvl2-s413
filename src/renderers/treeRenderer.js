import _ from 'lodash';

const stringify = (data, d) => {
  const result = Object.keys(data).map(key => `        ${'    '.repeat(d)}${key}: ${data[key]}`);
  return ['{', ...result, `    ${'    '.repeat(d)}}`].join('\n');
};
const toString = (data, d) => (data instanceof Object ? stringify(data, d) : data);

const types = [
  {
    type: 'unchanged',
    toStr: (obj, d) => `    ${'    '.repeat(d)}${obj.key}: ${toString(obj.value, d)}`,
  },
  {
    type: 'updated',
    toStr: (obj, d) => [`  ${'    '.repeat(d)}+ ${obj.key}: ${toString(obj.value.after, d)}`,
      `  ${'    '.repeat(d)}- ${obj.key}: ${toString(obj.value.before, d)}`],
  },
  {
    type: 'removed',
    toStr: (obj, d) => `  ${'    '.repeat(d)}- ${obj.key}: ${toString(obj.value, d)}`,
  },
  {
    type: 'added',
    toStr: (obj, d) => `  ${'    '.repeat(d)}+ ${obj.key}: ${toString(obj.value, d)}`,
  },
  {
    type: 'tree',
    toStr: (obj, d, iter) => {
      const children = _.flatten(iter(obj.value, d + 1, []));
      return `    ${'    '.repeat(d)}${obj.key}: ${['{', ...children, `    ${'    '.repeat(d)}}`].join('\n')}`;
    },
  },
];

const render = (ast) => {
  const iter = (arr, depth, acc) => {
    if (arr.length === 0) {
      return acc;
    }
    const [current, ...rest] = arr;
    const makeStr = _.find(types, { type: current.type }).toStr;
    const newAcc = [...acc, makeStr(current, depth, iter)];
    return iter(rest, depth, newAcc);
  };
  const result = iter(ast, 0, []);
  const flatten = _.flatten(result);
  return ['{', ...flatten, '}'].join('\n');
};

export default render;
