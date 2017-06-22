# SharePoint add-in with Express.js and PnP-JS-Core

This repository contains sample SharePoint add-in built with Node.js. Technologies used: 
 - [Experss.js](https://expressjs.com/) web framework
 - [Passport.js](http://passportjs.org) authentication with help of [passport-sharepoint-addin](https://github.com/s-KaiNet/passport-sharepoint-addin)
 - [MongoDB](https://www.mongodb.com/) and [mongoose](http://mongoosejs.com/)
 - [PnP-JS-Core](https://github.com/SharePoint/PnP-JS-Core) as a module for interacting with SharePoint REST API  

 ## How to run
 1. On your SharePoint site open App registration page at `https://company.sharepoint.com/sites/your_site/_layouts/15/appregnew.aspx` and register a new app. Generate ClientId and ClientSecret, use ane Title, for App Domain put `localhost:44355`, for Redirect URI put `https://localhost:44355/`
 2. Take a note on generated credentials. 
 3. Open SharePoint project from `sharepoint-addin` folder. 
 4. Open `AppManifest.xml` and change `ClientId` attribute of `RemoteWebApplication` to your generated `ClientId`
 5. Deploy the app using Visual Studio (right click on a project -> Deploy)
 5. Wait for project to be deployed. Click on "Trust it" in a browser after deployment. 
 6. Open command prompt at `web-app` folder.
 7. Run `npm install`
 5. Run `npm run start`. Wait for a while and you will see the server is started and message `Listening on port 44355`.
 5. Open your SharePoint site and click on the app. You will be redirected to the app home page. 

 ## How does it work

When you click on the app in SharePoint, you get redirected to `auth/sharepoint/appredirect`. The app extracts host url, creates a hash and stores it in Mongo. The the user is get authenticated. Authentication related data is stored inside session, the user information like login name and email are stored inside Mongo. 