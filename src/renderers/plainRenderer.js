const makeValue = (value) => {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return (value instanceof Object ? '[complex value]'.toString() : value);
};

const types = {
  updated: obj => `Property '${obj.key}' was updated. From ${makeValue(obj.value[0])} to ${makeValue(obj.value[1])}`,
  removed: obj => `Property '${obj.key}' was removed`,
  added: obj => `Property '${obj.key}' was added with value: ${makeValue(obj.value)}`,
};

const render = (ast) => {
  const result = ast.map((obj) => {
    if (obj.type === 'unchanged') {
      return null;
    }
    if (obj.type === 'tree') {
      const newName = obj.key;
      const newchildren = obj.children.map(el => ({ ...el, key: `${newName}.${el.key}` }));
      return render(newchildren);
    }
    return types[obj.type](obj);
  });
  return result.filter(v => v).join('\n');
};

export default render;
