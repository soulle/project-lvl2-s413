import plainRenderer from './plainRenderer';
import treeRenderer from './treeRenderer';
import jsonRenderer from './jsonRenderer';

const rendering = {
  tree: treeRenderer,
  plain: plainRenderer,
  json: jsonRenderer,
};

const render = (ast, type) => rendering[type](ast);
export default render;
