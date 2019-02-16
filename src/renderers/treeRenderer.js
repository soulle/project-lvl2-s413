import _ from 'lodash';

const stringify = (value, d) => {
  const result = Object.keys(value).map(key => `        ${'    '.repeat(d)}${key}: ${value[key]}`);
  return ['{', ...result, `    ${'    '.repeat(d)}}`].join('\n');
};
const toString = (value, d) => (value instanceof Object ? stringify(value, d) : value);

const minus = '- ';
const plus = '+ ';
const template = (obj, value, d, sign) => `  ${'    '.repeat(d)}${sign}${obj.key}: ${toString(value, d)}`;


const nodeTypes = {
  unchanged: (obj, d) => `  ${template(obj, obj.value, d, '')}`,
  updated: (obj, d) => [`${template(obj, obj.valueAfter, d, plus)}`,
    `${template(obj, obj.valueBefore, d, minus)}`],
  removed: (obj, d) => template(obj, obj.value, d, minus),
  added: (obj, d) => template(obj, obj.value, d, plus),
  tree: (obj, d, render) => {
    const children = render(obj.children, d + 1);
    return `    ${'    '.repeat(d)}${obj.key}: ${children}`;
  },
};

const render = (ast, depth = 0) => {
  const result = _.flattenDeep(ast.map(el => nodeTypes[el.type](el, depth, render)));
  return ['{', ...result, `${'    '.repeat(depth)}}`].join('\n');
};

export default render;
