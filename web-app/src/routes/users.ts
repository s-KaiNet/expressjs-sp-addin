import * as express from 'express';

export class UsersRoute {
  public router = express.Router();

  constructor() {
    this.router.route('/users')
      .get(this.getUsers);
  }

  public getUsers(req: express.Request, res: express.Response, next: express.NextFunction): void {

    res.send('respond with a resource');
  }
}

export default new UsersRoute().router;
