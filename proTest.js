// JavaScript source code
const process = require('process');
console.log(process.argv[2]);
let jstring = String(process.argv[2]);
console.log(typeof jstring);

let parsedjstring = JSON.parse(jstring);

console.log(parsedjstring);
console.log(typeof parsedjstring);





