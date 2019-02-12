#!/usr/bin/env node

import program from 'commander';
import generator from '..';

export default program
  .version('1.0.2')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action(generator)
  .parse(process.argv);
