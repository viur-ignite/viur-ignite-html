"use strict";

const PLUGIN_NAME = 'viur-ignite-html';

var path = require('path'),
	isThere = require('is-there'),
	fs = require('fs'),
	mkdirp = require('mkdirp');


module.exports = {
	build: function(options) {

		// Set Default Options
		var defaultOptions = {
			src: './sources/html/',
			dest: './appengine/html/'
		};

		if (typeof(options)==='undefined') var options = {};
		for (var key in defaultOptions) {
			if (typeof(options[key])==='undefined') options[key] = defaultOptions[key];
		}


		// Get menu(s) and parse as js dictionary
		var	menus = fs.readFileSync(options.src+"_menu.json", 'utf8');
			menus = JSON.parse(menus);


		// create an array with all sites of all menus
		var allSites = {}
		for(var menu in menus) {
			var sites = menus[menu];
			for(var item in sites) {
				allSites[item] = menus[menu][item];
			}
		}


		// get template
		var layout = fs.readFileSync(options.src+"_layout.html", 'utf8');


		for(var site in allSites) { // for each sites
			var siteTitle = allSites[site];
			var siteName = site.split('_')[0];
			var siteType = site.split('_')[1];


			console.log("Processing %s", siteName);


			// get content of file
			var content = fs.readFileSync(options.src+siteName, 'utf8');

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
					
					tmpMenu += '<li class="menu-item ' + menuName + '-item"><a class="menu-link' + (tmpSiteType == 'Primary' ? ' is-primary' : '') + (siteName == tmpSiteName ? ' is-active' : '') + '" href="' + tmpSiteName + '">' + tmpSiteTitle+ '</a></li>' + '\n';
				}

				tmp = tmp.replace( '{{'+menuName+'}}', tmpMenu ) // replace menu variable by menu items
			}


			// create destination folder if doesn't exists
			if(!isThere(options.dest)) {
				mkdirp(options.dest, function (err) {
					if (err) return console.error(err);
				
					writeFiles()
				});
			} else {
				writeFiles()
			}


			// need function as callback to make sure that writing starts after create folder
			function writeFiles() {
				// write file in destination folder
				fs.writeFile(options.dest + siteName, tmp, function(err) {
					if(err) return console.error(err);
				}); 
			}
		}

		return true;
	}
};

function sortProperties(obj) {
	var sortable = [];
	var dict = {};

	// convert object into array
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]

	// sort items by value
	sortable.sort(function(a, b) {
		var x=a[1].toLowerCase(),
			y=b[1].toLowerCase();
		return x<y ? -1 : x>y ? 1 : 0;
	});


	for(var key in sortable) {
		dict[sortable[key][0]] = sortable[key][1] // parse array to dictionary
	}

	return dict; // sorted dictionary
}