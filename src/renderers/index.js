import plainRenderer from './plainRenderer';
import treeRenderer from './treeRenderer';
import jsonRenderer from './jsonRenderer';

const formats = {
  tree: treeRenderer,
  plain: plainRenderer,
  json: jsonRenderer,
};

export default formats;
