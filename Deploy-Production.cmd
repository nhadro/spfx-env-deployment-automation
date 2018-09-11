Gulp clean & ^
Gulp update-component-manifests --env prod & ^
Gulp update-package-manifest --env prod & ^
Gulp update-manifest --cdnpath https://yourtenant.sharepoint.com/cdn/automation-tutorial-prod & ^
Gulp & ^
Gulp bundle --ship & ^
Gulp upload-to-sharepoint --cdnpath cdn/automation-tutorial-prod & ^
Gulp package-solution --ship & ^
Gulp upload-app-pkg --appcatalogsite https://yourtenant.sharepoint.com/sites/appcatalog & ^
Gulp deploy-sppkg --appcatalogpath sites/appcatalog
	
	
	
