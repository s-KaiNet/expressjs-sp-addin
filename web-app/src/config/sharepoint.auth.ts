import { Application, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import NavigationManager from '../common/navigation.manager';

export let callbackUrl = '/auth/sharepoint/callback';
export let appRedirect = '/auth/sharepoint/appredirect';

export default function (app: Application, passport: PassportStatic) {

    app.post(appRedirect, (req: Request, res: Response, next: NextFunction) => {

        let hostUrl = req.query['SPHostUrl'];
        let navManager: NavigationManager = new NavigationManager();
        navManager.getHostByUrl(hostUrl)
            .then((host) => {
                let redirectUrl: string = `/${host.shortHandUrl}`;
                if (req.isAuthenticated()) {
                    return res.redirect(redirectUrl);
                }

                return passport.authenticate('sharepoint')(req, res, next);
            })
            .catch(err => {
                throw err;
            });
    });

    // the callback after google has authenticated the user
    app.post(callbackUrl, (req: Request, res: Response, next: NextFunction) => {

        let hostUrl = req.query['SPHostUrl'];
        let navManager: NavigationManager = new NavigationManager();
        navManager.getHostByUrl(hostUrl)
            .then((host) => {
                let redirectUrl: string = `/${host.shortHandUrl}`;
                return passport.authenticate('sharepoint', { successRedirect: redirectUrl })(req, res, next);
            })
            .catch(err => {
                throw err;
            });
    });
}
