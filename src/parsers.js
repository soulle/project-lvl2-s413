import yaml from 'js-yaml';
import ini from 'ini';

const parsing = {
  '.json': data => JSON.parse(data),
  '.yml': data => yaml.safeLoad(data),
  '.ini': data => ini.parse(data),
};

const parse = (data, ext) => parsing[ext](data);

export default parse;
