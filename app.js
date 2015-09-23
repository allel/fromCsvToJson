var csv = require('fast-csv');
var jsonfile = require('jsonfile');
var _ = require('lodash-node');
var extend = require('extend');


function transform(data, value) {
    var myarray = data.split('.');
    if (myarray && myarray.length > 1) {
        var last = myarray.pop();
        obj = {};
        obj[last] = value;
        return transform(myarray.join('.'), obj);
    }
    obj = {};
    obj[data] = value;
    return obj;
}


var argv = require('yargs')
    .command('create', 'Create json from csv', function (yargs) {
        yargs.options({
            input: {
                demand: true,
                alias: 'i',
                type: 'string',
                description: 'csv file path input'
            },
            output: {
                demand: true,
                alias: 'o',
                type: 'string',
                description: 'json file path output'
            },
            space: {
                demand: true,
                alias: 's',
                type: 'integer',
                description: 'Spaces of json path'
            }
        }).help('help')
    })
    .help('help')
    .argv;

var command = argv._[0];

if (command === 'create') {
    var traduction = {};
    csv
        .fromPath(argv.input)
        .on('data', function (data) {
            try {
                if (!data || data.length < 2) {
                    throw new CSSValue('Erreur sur le fichier csv');
                }
                extend(true, traduction, transform(data[0], data[1]));
            } catch (e) {
                console.log('Erreur de transformation ' + e.message);
            }
        })
        .on('end', function () {
            jsonfile.writeFile(argv.output, traduction, {spaces: argv.space}, function (err) {
                if (err) {
                    console.error('Error ' + err)
                }
            })
        });
}
