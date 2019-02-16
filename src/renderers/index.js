import plainRenderer from './plainRenderer';
import treeRenderer from './treeRenderer';

const rendering = {
  tree: treeRenderer,
  plain: plainRenderer,
  json: JSON.stringify,
};

const render = (ast, type) => rendering[type](ast);
export default render;
