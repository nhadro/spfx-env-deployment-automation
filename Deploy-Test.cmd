Gulp clean & ^
Gulp update-component-manifests --env test & ^
Gulp update-package-manifest --env test & ^
Gulp update-manifest --cdnpath https://yourtenant.sharepoint.com/cdn/automation-tutorial-test & ^
Gulp & ^
Gulp bundle --ship & ^
Gulp upload-to-sharepoint --cdnpath cdn/automation-tutorial-test & ^
Gulp package-solution --ship & ^
Gulp upload-app-pkg --appcatalogsite https://yourtenant.sharepoint.com/sites/appcatalog & ^
Gulp deploy-sppkg --appcatalogpath sites/appcatalog
	
	
	
