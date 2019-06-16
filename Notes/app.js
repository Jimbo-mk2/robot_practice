const chalk = require('chalk');
const validator = require('validator');
const notes = require('./notes.js');

const msg = notes();

console.log(msg);
console.log(validator.isEmail('jameswaltonmk2@gmail.com'));
console.log(chalk.red('Fail'));
// const add = require('./utils.js');
// const sum = add(2, 5);
// console.log(sum);

