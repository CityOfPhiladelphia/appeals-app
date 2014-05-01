# Philadelphia Zoning Appeals App

You can use this application to view scheduled zoning board appeals from the past 30 days going forward.

## Technology

This application is a JavaScript single-page app written in [Backbone.js](http://backbonejs.org) with [Underscore](http://underscorejs.org) templates and a [Leaflet.js](http://leafletjs.com) web map. It is written in modules, using [Require.js](http://requirejs.org) for AMD loading, and uses [Gulp.js](http://gulpjs.com) and [Grunt.js](http://gruntjs.com) for the build process.

## Help Improve This App

We'd welcome your suggestions and feedback. Please submit issues and pull requests on the GitHub repository.

## Installation

First, make sure you have [Node.js](http://nodejs.org) installed.

1. Clone the repository by using `git clone git@github.com:CityOfPhiladelphia/zoning-appeals.git`
2. Navigate inside the newly created directory by using `cd zoning-appeals`
3. Install server dependencies by using `npm install` (will install the packages in package.json)
4. Install [Bower](http://bower.io) package manager globally by using `sudo npm install -g bower` (it may prompt you to re-enter your password)
6. Install client dependencies by using `bower install` (will install the packages in bower.json)

## Running Locally

You can now browse to the `app/` directory in the browser to view the development version of the app, which will load more slowly since it loads every file separately. Or, use `grunt serve` to start a NodeJS server.  

## Building  

To build the app into a single, production file, from the command line:

1. `gulp`
2. `grunt stripmq` (Gulp doesn't have a suitable module for stripping media queries for older IE versions yet)
3. `gulp ie` (to add the previous task's CSS output to the `index.html` page)

## Source Control

To push changes back to the repository, navigate to the root directory of the app and use `git add .` to find all changes in the directory, then `git commit -m "Summary of the changes"` to group the changes into one commit, then `git push origin master` to push the changes to the GitHub repository.

## Production Deployment

The build process puts files in the `app/build/` directory, which is ignored by the git repository. To push the built app to production, we'll create another git repository inside the `app/build/` directory using the `gh-pages` branch. To do this:

1. Delete the `app/build/` directory
2. Navigate to `app/`
3. Use `git clone -b gh-pages -o production git@github.com:CityOfPhiladelphia/zoning-appeals.git build` to clone the `gh-pages` branch of the repository into the `app/build/` directory and name the remote "production"

Once you've done that, you can run the build process described above, then navigate inside `app/build/` and use `git add .`, `git commit -m "Summary of changes"`, and `git push production gh-pages` to deploy. Be sure to specify `gh-pages` in the final command or you will experience merge issues.