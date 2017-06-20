import * as express from 'express';

export class ProfileRoute {
    public router = express.Router();

    constructor() {
        this.router.route('/profile')
            .get(isLoggedIn, this.getProfile);
    }

    public getProfile(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.render('profile', { user: req.user });
    }
}

function isLoggedIn(req: express.Request, res: express.Response, next: express.NextFunction) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}

export default new ProfileRoute().router;
