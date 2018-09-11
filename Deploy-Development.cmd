Gulp clean & ^
Gulp update-component-manifests --env dev & ^
Gulp update-package-manifest --env dev & ^
Gulp update-manifest --cdnpath https://yourtenant.sharepoint.com/cdn/automation-tutorial-dev & ^
Gulp & ^
Gulp bundle --ship & ^
Gulp upload-to-sharepoint --cdnpath cdn/automation-tutorial-dev & ^
Gulp package-solution --ship & ^
Gulp upload-app-pkg --appcatalogsite https://yourtenant.sharepoint.com/sites/appcatalog & ^
Gulp deploy-sppkg --appcatalogpath sites/appcatalog
	
	
	
