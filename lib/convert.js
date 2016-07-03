function escapeShellArg (cmd) {
    return '\'' + cmd.replace(/\'/g, "'\\''") + '\'';
}

function convertSingleFile(input, output, bitrate, callback)
{
    var exec = require('child_process').exec;
    var cmd = 'ffmpeg -i '+escapeShellArg(input)+' -b '+bitrate+' '+escapeShellArg(output);

    exec(cmd, function(error, stdout, stderr) {
        callback(error, stdout, stderr);
    });
}

module.exports.convertSingleFile = convertSingleFile;
