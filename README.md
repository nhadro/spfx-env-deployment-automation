# SPFX Environment Automated Deployment

This project provides an approach to have Development,Test, and Production versions of webparts and extensions in a single Tenant.

The deployment is completely automated running through gulp files to modify the manifest files as needed and then deploying each package to the AppCatalog.

After each package is deployed to the appcatalog, you can create a site collection for Dev/Test/Prod and put the corresponding webparts/extensions in that site.

When you each environment package is updated and deployed, only the corresponding version of the webparts will be updated.

Development webparts have -Development appended, Test has -Test and Prod has the original webpart name.


### To Get started

1.  Clone the respository to your local machine
2.  Run "npm install"
3.  Update the "gulp.js" file setting your "username", "password", "tenant" and "cdnSiteUrl" in environmentDeploy object.
4.  Update the Deploy- files with the correct CDN path urls as well as the appcatalog paths.
5.  Run Deploy-Development.cmd
        - This will:
            a.  Clean the solution
            b.  Run the gulp task to update the component manifests.
            c.  Run the gulp task to update the package solution manifest.
            d.  Run the gulp task to update the write-manifest
            e.  Run the normal gulp command
            f.  Bundle using the --ship command.
            g.  Upload all solution assets to the CDN specified
            h.  Package the solution using the --ship command
            i.  Upload the newly created package to the app catalog
            j.  Deploy the newly added solution.

6.  Now you will be able to add "HelloWorld-Development" on a page.  

The Production batch file can also be run to deploy the production package.

### Thanks To

Many thanks to Elio Struyf who provided a significant portion of the deployment automation scripts in his release pipeline article below.

[Configure a build and release pipeline for your SharePoint Framework solution deployments](https://www.eliostruyf.com/configure-a-build-and-release-pipeline-for-your-sharepoint-framework-solution-deployments//)



