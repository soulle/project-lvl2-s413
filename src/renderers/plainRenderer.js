const makeValue = (value) => {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return (value instanceof Object ? '[complex value]'.toString() : value);
};

const types = {
  updated: obj => `Property '${obj.key}' was updated. From ${makeValue(obj.value.before)} to ${makeValue(obj.value.after)}`,
  removed: obj => `Property '${obj.key}' was removed`,
  added: obj => `Property '${obj.key}' was added with value: ${makeValue(obj.value)}`,
  unchanged: obj => `${obj} wasnt changed`,
  tree: (obj, func) => {
    const newName = obj.key;
    const newchildren = obj.value.map(el => ({ ...el, key: `${newName}.${el.key}` }));
    return func(newchildren);
  },
};

const render = (ast) => {
  const result = ast.map(obj => types[obj.type](obj, render));
  return result.filter(el => !el.includes('wasnt changed')).join('\n');
};

export default render;