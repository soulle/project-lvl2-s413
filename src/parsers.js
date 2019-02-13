import yaml from 'js-yaml';

const parsing = {
  '.json': data => JSON.parse(data),
  '.yml': data => yaml.safeLoad(data),
};

const parse = (data, ext) => parsing[ext](data);

export default parse;
