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

function initLangObj(langArray) {
    var trad = {};
    _.forEach(langArray, function (lang) {
        var split = lang.split(':');
        if (split && split.length > 1) {
            trad[split[0]] = {};
        } else {
            throw new Error('erreur sur le format des langues');
        }
    });
    return trad;
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
            },
            langues: {
                demand: false,
                alias: 'l',
                type: 'array',
                description: 'Liste des langues sous la forme suivante : fr:53 en:75 es:35 ...'
            }
        }).help('help')
    })
    .help('help')
    .argv;

var command = argv._[0];

if (command === 'create') {
    var langarray = argv.langues ? argv.langues : ["en:53", "fr:75", "de:86", "es:156", "cn:37"];
    var traduction = initLangObj(langarray);

    csv
        .fromPath(argv.input)
        .on('data', function (data) {
            try {
                if (!data || data.length < 3) {
                    throw new Error('Erreur sur le fichier csv');
                }

                _.forEach(langarray, function eachLang(l) {
                    var split = l.split(':');
                    if (data[2] === split[1]) {
                        extend(true, traduction[split[0]], transform(data[0], data[1]));
                    }
                });
            } catch (e) {
                console.error('Erreur de transformation ' + e.message);
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
