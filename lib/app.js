var fs = require('fs');
var convertSingleFile = require('./convert').convertSingleFile;
var path = require('path');

function app(argv){
    var input = argv.input || argv.i || argv._[0];
    var output = argv.output || argv.o || null;
    var bitrate = argv.bitrate || argv.b || '128k';
    var force = argv.force || argv.f || false;

    var inputMode = 'file';
    var outputMode = 'file';

    // resolve absolute paths
    input = path.resolve(input);
    if(!fs.existsSync(input)){
        console.log('Arquivo/diretório de entrada não encontrado.');
        process.exit(1);
    }

    if(fs.lstatSync(input).isDirectory()){
        inputMode = 'directory';
        outputMode = 'directory';
    }

    if(inputMode == 'file'){
        console.log('Convertendo arquivo para '+bitrate+': "'+input+'"...');

        if(fs.existsSync(output)){
            if(!force){
                console.log('Arquivo de saída já existe. Abortando.');
                console.log('Para sobrescrever o arquivo existente, utilize a opção -f');
                process.exit(1);
            } else {
                fs.unlinkSync(output);
            }
        }

        if(!output){
            output = path.basename(input, '.mp3') + '-compressed.mp3';
        }

        convertSingleFile(input, output, bitrate, function(err, stdout, stderr){
            console.log(err, stdout, stderr);
        });
    } else {
        console.log('Convertendo pasta de arquivos para '+bitrate+': "'+input+'"...');

        if(fs.existsSync(output) && !force){
            console.log('A pasta de saída já existe. Abortando.');
            console.log('Para sobrescrever a pasta de saída existente, utilize a opção -f');
            process.exit(1);
        }

        if(!output){
            output = path.join(path.resolve(input), 'compressed');
        }

        if(!fs.existsSync(output)){
            fs.mkdirSync(output);
        }

        var convertList = [];

        var files = fs.readdirSync(input);
        files.forEach(function(item){
            if(fs.lstatSync(path.join(input, item)).isFile()){
                if(path.extname(item) == '.mp3'){
                    convertList.push(path.join(input, item));
                }
            }
        });

        if(convertList.length){
            convertList.forEach(function(file){
                var outputFile = path.join(output, path.basename(file, '.mp3') + '-compressed.mp3');
                convertSingleFile(file, outputFile, bitrate, function(err, stdout, stderr){
                    // console.log(err, stdout, stderr);
                    console.log('=> ', file, '=> OK');
                });
            });
        } else {
            console.log('Não foram encontrados arquivos MP3 no caminho indicado.');
            process.exit(1);
        }
    }

}

module.exports = app;
