var gulp = require('gulp');
var rename = require('gulp-rename');

var path = require('path');
var isThere = require('is-there');
var fs = require('fs');
var mkdirp = require('mkdirp');


htmlDir = "./sources/html/"
appengineDir = "./appengine/html/"


module.exports = {
	build: function() {
		var	sites = fs.readFileSync(htmlDir+"_sites.json", 'utf8');
			sites = JSON.parse(sites); // parse json
			sites = sortProperties(sites) // Sort sites by value alphabetically

		var layout = fs.readFileSync(htmlDir+"_layout.html", 'utf8');

		for(var item in sites) {
			var site	= sites[item][0];
			var title	= sites[item][1];
			console.log("Processing %s", site)

			// build navigation
			var	tmpMenu1 = '<li class="menu-item"><a class="menu-link is-primary' + (site == "index.html" ? ' is-active' : '') + '" href="index.html">Start</a></li>' + '\n'
				tmpMenu1 += '<li class="menu-item"><a class="menu-link' + (site == "gettingStarted.html" ? ' is-active' : '') + '" href="gettingStarted.html">Getting Started</a></li>' + '\n'
			var	tmpMenu2 = ''
			
			for(var subitem in sites) {
				var subSite		= sites[subitem][0];
				var subTitle	= sites[subitem][1];
			
				if(subSite == "index.html" || subSite == "gettingStarted.html") 
					continue

				tmpMenu2 += '<li class="menu-item"><a class="menu-link' + (site == subSite ? ' is-active' : '') + '" href="' + subSite + '">' + subTitle+ '</a></li>' + '\n'
			}
			
			// get content of file
			var tmpContent = fs.readFileSync(htmlDir+site, 'utf8');

			// replace variables in template by content
			var tmp = layout.replace( '{{title}}', title ).replace( '{{menu1}}', tmpMenu1 ).replace( '{{menu2}}', tmpMenu2 ).replace( '{{content}}', tmpContent )

			// write file in appengine/html

			if(!isThere(appengineDir)) {
				mkdirp(appengineDir, function (err) {
    				if (err) return console.error(err)
				});
			}
			

			fs.writeFile(appengineDir + site, tmp, function(err) {
				if(err) return console.log(err);
			}); 
		}
	}
};

function dirname(path) {
	return path.replace(/\\/g, '/')
		.replace(/\/[^\/]*\/?$/, '');
}

function sortProperties(obj) {
  // convert object into array
    var sortable=[];
    for(var key in obj)
        if(obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function(a, b)
    {
        var x=a[1].toLowerCase(),
            y=b[1].toLowerCase();
        return x<y ? -1 : x>y ? 1 : 0;
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}