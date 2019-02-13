import yaml from 'js-yaml';
import ini from 'ini';

const parsing = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parse = (data, ext) => parsing[ext](data);

export default parse;
