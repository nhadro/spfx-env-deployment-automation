'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const fs = require('fs');
var Finder = require('fs-finder');
var Hjson = require('hjson');
const sppkgDeploy = require('node-sppkg-deploy');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(/Admins can make this solution available to all sites in the organization/);

var environmentDeploy = {
  username: "",
  password: "",
  tenant: "yourtenant", //If your domain is 'https://mytenant.sharepoint.com', then enter 'mytenant' for this value.
  cdnSiteUrl: "https://yourtenant.sharepoint.com/"  //Enter https://mytenant.sharepoint.com/ for this value, cdn path will get appended.
}

//All manifest Id's will have the first 8 digits of their ID replaced with this value
function determineManifestIdPrefix(env) {
    switch (env) {
        case "dev": return "00000000";
        case "test": return "11111111";
        case "prod": return "22222222";
        default: return "00000000";
    }
}

//In the package-solution.json, the package name and pacakge.sppkg will have this value appended to them.
var packageNamePostValues = ["-DevelopmentEnv", "-TestEnv", "-ProductionEnv"]
function determinePackageNamePostValue(env) {
    switch (env) {
        case "dev": return packageNamePostValues[0];
        case "test": return packageNamePostValues[1];
        case "prod": return packageNamePostValues[2];

        default: return packageNamePostValues[0];
    }
}

//All webparts will have this value appended to them so you know which version of the webpart it is.
var webpartTitlesPostValues = ["-Development", "-Test", ""]
function determineWebPartTitlesPostValue(env) {
    switch (env) {
        case "dev": return webpartTitlesPostValues[0];
        case "test": return webpartTitlesPostValues[1];
        case "prod": return webpartTitlesPostValues[2];

        default: return webpartTitlesPostValues[0];
    }
}

//Loop through all the webpart/extension manifests and update the id field.  Also for webparts update the title.
build.task("update-component-manifests", {
    execute: (config) => {
        return new Promise((resolve, reject) => {

            var files = Finder.from("./src").findFiles('*.manifest.json')

            files.forEach(file => {
                let relativePath = "./src/" + (file.split("\\src\\")[1]).replace(/\\/g, "/");

                let jsonText = fs.readFileSync(relativePath, "utf8")
                let json = Hjson.parse(jsonText);

                json.id = determineManifestIdPrefix(config.args['env']) + json.id.slice(8);
                if (json.preconfiguredEntries) {
                    webpartTitlesPostValues.forEach(postTitle => {
                        json.preconfiguredEntries[0].title.default = json.preconfiguredEntries[0].title.default.replace(postTitle, "")
                    });

                    json.preconfiguredEntries[0].title.default += determineWebPartTitlesPostValue(config.args['env']);
                }
                fs.writeFileSync(relativePath, JSON.stringify(json));

            });

            resolve();
        })
    }
})

//Update write-manifest.json to have the CDN passed in as config value
build.task('update-manifest', {
    execute: (config) => {
        return new Promise((resolve, reject) => {
            const cdnPath = config.args['cdnpath'];

            let json = JSON.parse(fs.readFileSync('./config/write-manifests.json'));
            json.cdnBasePath = cdnPath;
            fs.writeFileSync('./config/write-manifests.json', JSON.stringify(json));

            resolve();
        });
    }
});

//Update package-solution.json (update id, name and zipped name)
build.task('update-package-manifest', {
    execute: (config) => {
        return new Promise((resolve, reject) => {

            let json = JSON.parse(fs.readFileSync('./config/package-solution.json'));

            //Update the name
            packageNamePostValues.forEach(postName => {
                json.solution.name = json.solution.name.replace(postName, '')
            });
            json.solution.name += determinePackageNamePostValue(config.args['env']);

            //Update the ID
            json.solution.id = determineManifestIdPrefix(config.args['env']) + json.solution.id.slice(8);

            //Update zipped name
            packageNamePostValues.forEach(postValue => {
                json.paths.zippedPackage = json.paths.zippedPackage.replace(postValue + ".sppkg", '')
            });
            json.paths.zippedPackage = json.paths.zippedPackage.replace('.sppkg', '');
            json.paths.zippedPackage += (determinePackageNamePostValue(config.args['env']) + ".sppkg");

            fs.writeFileSync('./config/package-solution.json', JSON.stringify(json));
            resolve();
        });
    }
});


const spsync = require('gulp-spsync-creds').sync;

build.task('upload-to-sharepoint', {
    execute: (config) => {
        return new Promise((resolve, reject) => {
            const deployFolder = require('./config/copy-assets.json');
            const folderLocation = `./${deployFolder.deployCdnPath}/**/*.*`;
            return gulp.src(folderLocation)
                .pipe(spsync({
                    "username": environmentDeploy.username,
                    "password": environmentDeploy.password,
                    "site": environmentDeploy.cdnSiteUrl,
                    "libraryPath": `${config.args['cdnpath']}/`,
                    "publish": true
                }))
                .on('finish', resolve);
        });
    }
});


build.task('upload-app-pkg', {
    execute: (config) => {
        return new Promise((resolve, reject) => {
            const pkgFile = require('./config/package-solution.json');

            const folderLocation = `./sharepoint/${pkgFile.paths.zippedPackage}`;

            return gulp.src(folderLocation)
                .pipe(spsync({
                    "username": environmentDeploy.username,
                    "password": environmentDeploy.password,
                    "site": config.args['appcatalogsite'],
                    "libraryPath": "AppCatalog",
                    "publish": true
                }))
                .on('finish', resolve);
        });
    }
});

build.task('deploy-sppkg', {
    execute: (config) => {

        const pkgFile = require('./config/package-solution.json');
        if (pkgFile) {
            // Retrieve the filename from the package solution config file
            let filename = pkgFile.paths.zippedPackage;
            // Remove the solution path from the filename
            filename = filename.split('/').pop();
            // Retrieve the skip feature deployment setting from the package solution config file
            const skipFeatureDeployment = pkgFile.solution.skipFeatureDeployment ? pkgFile.solution.skipFeatureDeployment : false;


            // Deploy the SharePoint package
            return sppkgDeploy.deploy({
                username: environmentDeploy.username,
                password: environmentDeploy.password,
                tenant: environmentDeploy.tenant,
                site: config.args['appcatalogpath'],
                filename: filename,
                skipFeatureDeployment: skipFeatureDeployment,
                verbose: true
            });
        }
    }
});




build.initialize(gulp);
