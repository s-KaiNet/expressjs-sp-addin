import { Request, Response, Router, NextFunction } from 'express';
import * as pnp from 'c:/Projects/gh/frk/PnP-JS-Core/src/pnp';

import { oauthConfig } from '../config/private.config';
import { SPContextProvider } from '../temp';

export class IndexRoute {
  public router = Router();

  constructor() {
    this.router.route('/')
      .get(this.index);
  }

  public index(req: Request, res: Response, next: NextFunction): void {
    let ctx = SPContextProvider.get(req.user.authData, oauthConfig);

    ctx.getUserAccessTokenForSPHost()
      .then(token => {
        return pnp.sp.configure({
          'Authorization': `Bearer ${token}`
        }, req.user.authData.spHostUrl);
      })
      .then(sp => {
        return sp.web.get();
      })
      .then(web => {
        res.render('index', {
          title: 'Express',
          username: req.user.dbUser.sharepoint.name
        });
      });
  }
}

export default new IndexRoute().router;
