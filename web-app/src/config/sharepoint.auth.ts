import { Application, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import NavigationManager from '../common/navigation.manager';

export let callbackUrl = '/auth/sharepoint/callback';
export let appRedirect = '/auth/sharepoint/appredirect';
import { Consts } from 'passport-sharepoint-addin';

export default function (app: Application, passport: PassportStatic) {

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated()) {
            next();
            return;
        }

        if (req.path.startsWith('/auth')) {
            next();
            return;
        }
        const shortHandUrl = req.path.split('/')[1];
        const userShortHandUrl = req.user.authData.shortHandUrl;

        if (shortHandUrl !== userShortHandUrl) {
            req.logOut();
        }

        next();
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            next();
            return;
        }

        if (req.path.startsWith('/auth')) {
            next();
            return;
        }
        const shortHandUrl = req.path.split('/')[1];
        const navManager: NavigationManager = new NavigationManager();
        navManager.getHostByShortHandUrl(shortHandUrl)
            .then(host => {
                res.redirect(`${appRedirect}?${Consts.SPHostUrl}=${host.url}`);
            })
            .catch(next);
    });

    app.all(appRedirect, (req: Request, res: Response, next: NextFunction) => {

        const hostUrl = req.query['SPHostUrl'];
        const navManager: NavigationManager = new NavigationManager();
        navManager.getHostByUrl(hostUrl)
            .then((host) => {
                const redirectUrl: string = `/${host.shortHandUrl}`;
                if (req.isAuthenticated()) {
                    return res.redirect(redirectUrl);
                }

                return passport.authenticate('sharepoint')(req, res, next);
            })
            .catch(next);
    });

    app.post(callbackUrl, (req: Request, res: Response, next: NextFunction) => {

        const hostUrl = req.query['SPHostUrl'];
        const navManager: NavigationManager = new NavigationManager();
        navManager.getHostByUrl(hostUrl)
            .then((host) => {
                const redirectUrl: string = `/${host.shortHandUrl}`;
                return passport.authenticate('sharepoint', { successRedirect: redirectUrl })(req, res, next);
            })
            .catch(next);
    });
}
