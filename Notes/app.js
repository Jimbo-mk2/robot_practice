const chalk = require('chalk');
const yargs = require('yargs');
const getNotes = require('./notes.js');

yargs.version('1.1.0');



yargs.command({
    command: 'add',
    describe: 'Add a new note',
    handler: function () {
        console.log('Adding new note');
    }
});

yargs.command({
    command: 'remove',
    describe: 'Removing note',
    builder: {
        title: {
            describe: 'Note Title',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        console.log('Removing the note', argv);
    }
});

yargs.command({
    command: 'list',
    describe: 'Listing notes',
    handler: function () {
        console.log('Listing the notes');
    }
});

yargs.command({
    command: 'read',
    describe: 'Reading note',
    handler: function () {
        console.log('Reading the note');
    }
});

yargs.parse();