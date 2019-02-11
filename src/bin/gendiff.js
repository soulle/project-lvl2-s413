#!/usr/bin/env node

const program = require('commander');

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-h, --help', 'output usage information')
  .option('-V, --version', 'output the version number')
  .option('-f, --format [type]', 'output format')

program.on('--help', function(){
  console.log('')
})
  
program.parse(process.argv);

program.help();