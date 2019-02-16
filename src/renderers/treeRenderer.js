import _ from 'lodash';

const stringify = (value, d) => {
  const result = Object.keys(value).map(key => `        ${'    '.repeat(d)}${key}: ${value[key]}`);
  return ['{', ...result, `    ${'    '.repeat(d)}}`].join('\n');
};
const toString = (value, d) => (value instanceof Object ? stringify(value, d) : value);

const minus = '- ';
const plus = '+ ';
const template = (obj, value, d, sign) => `  ${'    '.repeat(d)}${sign}${obj.key}: ${toString(value, d)}`;


const nodeTypes = [
  {
    type: 'unchanged',
    toStr: (obj, d) => `  ${template(obj, obj.value, d, '')}`,
  },
  {
    type: 'updated',
    toStr: (obj, d) => [`${template(obj, obj.value.after, d, plus)}`,
      `${template(obj, obj.value.before, d, minus)}`],
  },
  {
    type: 'removed',
    toStr: (obj, d) => template(obj, obj.value, d, minus),
  },
  {
    type: 'added',
    toStr: (obj, d) => template(obj, obj.value, d, plus),
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
    const makeStr = _.find(nodeTypes, { type: current.type }).toStr;
    const newAcc = [...acc, makeStr(current, depth, iter)];
    return iter(rest, depth, newAcc);
  };
  const result = iter(ast, 0, []);
  const flatten = _.flatten(result);
  return ['{', ...flatten, '}'].join('\n');
};

export default render;
