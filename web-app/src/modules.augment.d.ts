import { ISessionUser } from './common/ISessionUser';

declare module 'express' {
  interface Request {
    user: ISessionUser;
  }
}