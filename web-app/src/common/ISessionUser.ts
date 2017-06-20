import { IUserModel } from '../models/user';
import { IAuthData } from '../temp';

export interface ISessionUser {
    dbUser: IUserModel;
    authData: IAuthData;
}
