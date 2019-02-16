const makeValue = (value) => {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return (value instanceof Object ? '[complex value]' : value);
};

const types = {
  updated: obj => `Property '${obj.key}' was updated. From ${makeValue(obj.valueBefore)} to ${makeValue(obj.valueAfter)}`,
  removed: obj => `Property '${obj.key}' was removed`,
  added: obj => `Property '${obj.key}' was added with value: ${makeValue(obj.value)}`,
  unchanged: () => null,
  tree: (obj, func) => {
    const parent = obj.key;
    const newChildren = obj.children.map(el => ({ ...el, key: `${parent}.${el.key}` }));
    return func(newChildren);
  },
};

const render = (ast) => {
  const result = ast.map(obj => types[obj.type](obj, render));
  return result.filter(v => v).join('\n');
};

export default render;
