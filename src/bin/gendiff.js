#!/usr/bin/env node
import genDiff from '..';
import program from 'commander';

export default program
  .version('1.0.2')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action(genDiff)
  .parse(process.argv);
