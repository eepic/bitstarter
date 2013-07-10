#!/usr/bin/env node

var fs = require('fs');
var fs2 = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "thisurlwontwork";
var TMPFILE_DEFAULT = "tmp.html"; 

        
//EC the restler part
var sys = require('util');
var rest = require('restler');


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'URL to html file', URL_DEFAULT)
        .parse(process.argv);
    
    if (program.url == URL_DEFAULT) { //no URL specified
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }
    else {
	rest.get(program.url).on('complete', function(data) {
                //console.log("got url %s", program.url);
		//console.log(data.toString());
		fs2.writeFileSync(TMPFILE_DEFAULT, data);
		//console.log("wrote tmp file");
		var checkJson = checkHtmlFile(TMPFILE_DEFAULT, program.checks);
		var outJson = JSON.stringify(checkJson, null, 4);
		console.log(outJson);
        });
    }

    //var checkJson = checkHtmlFile(program.file, program.checks);
    //var outJson = JSON.stringify(checkJson, null, 4);
    //console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
