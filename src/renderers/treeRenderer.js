import _ from 'lodash';

const stringify = (data, d) => {
  const result = Object.keys(data).map(key => `        ${'    '.repeat(d)}${key}: ${data[key]}`);
  return ['{', ...result, `    ${'    '.repeat(d)}}`].join('\n');
};
const toString = (data, d) => (data instanceof Object ? stringify(data, d) : data);

const types = {
  unchanged: (obj, d) => `    ${'    '.repeat(d)}${obj.key}: ${toString(obj.value, d)}`,
  updated: (obj, d) => [`  ${'    '.repeat(d)}+ ${obj.key}: ${toString(obj.value[1], d)}`,
    `  ${'    '.repeat(d)}- ${obj.key}: ${toString(obj.value[0], d)}`],
  removed: (obj, d) => `  ${'    '.repeat(d)}- ${obj.key}: ${toString(obj.value, d)}`,
  added: (obj, d) => `  ${'    '.repeat(d)}+ ${obj.key}: ${toString(obj.value, d)}`,
};

const render = (ast) => {
  const iter = (arr, depth, acc) => {
    if (arr.length === 0) {
      return acc;
    }
    const [current, ...rest] = arr;
    if (current.type === 'tree') {
      const children = _.flatten(iter(current.children, depth + 1, []));
      const newAcc = [...acc, `    ${'    '.repeat(depth)}${current.key}: ${['{', ...children, `    ${'    '.repeat(depth)}}`].join('\n')}`];
      return iter(rest, depth, newAcc);
    }
    const newAcc = [...acc, types[current.type](current, depth)];
    return iter(rest, depth, newAcc);
  };
  const result = iter(ast, 0, []);
  const flatten = _.flatten(result);
  return ['{', ...flatten, '}'].join('\n');
};

export default render;
