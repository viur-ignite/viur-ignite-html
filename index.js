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
		var	menus = fs.readFileSync(htmlDir+"_menu.json", 'utf8');
			menus = JSON.parse(menus); // parse json

		var allSites = {}
		for(var menu in menus) {
			var sites = menus[menu];
			for(var item in sites) {
				allSites[item] = menus[menu][item]; // create a array with all sites of all menus
			}
		}


		var layout = fs.readFileSync(htmlDir+"_layout.html", 'utf8'); // get template


		for(var site in allSites) { // for each sites
			var siteTitle = allSites[site];
			var siteName = site.split('_')[0];
			var siteType = site.split('_')[1];


			console.log("Processing %s", siteName)


			// get content of file
			var content = fs.readFileSync(htmlDir+siteName, 'utf8');

			// replace title and content variables in template
			var tmp = layout.replace( '{{title}}', siteTitle ).replace( '{{content}}', content);


			for(var menu in menus) { // for each menu
				var menuName = menu.split('_')[0];
				var menuType = menu.split('_')[1];
				var sites = menus[menu];
				var	tmpMenu = ''

				if(menuType == 'Sort')
					sites = sortProperties(sites) // Sort sites by value alphabetically if suffix == sort
				
				for(var tmpSite in sites) { // for each site in this menu build menu item
					var tmpSiteTitle = sites[tmpSite];
					var tmpSiteName = tmpSite.split('_')[0];
					var tmpSiteType = tmpSite.split('_')[1];
					
					tmpMenu += '<li class="menu-item ' + menuName + '-item"><a class="menu-link' + (tmpSiteType == 'Primary' ? ' is-primary' : '') + (siteName == tmpSiteName ? ' is-active' : '') + '" href="' + tmpSiteName + '">' + tmpSiteTitle+ '</a></li>' + '\n'
				}

				tmp = tmp.replace( '{{'+menuName+'}}', tmpMenu ) // replace menu variable by menu items
			}


			// create folder appengine/html if doesn't exists
			if(!isThere(appengineDir)) {
				mkdirp(appengineDir, function (err) {
					if (err) return console.error(err)
				});
			}
			
			// write file in appengine/html
			fs.writeFile(appengineDir + siteName, tmp, function(err) {
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
	var dict={};
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


	for(var key in sortable) {
		dict[sortable[key][0]] = sortable[key][1]
	}
	return dict; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}