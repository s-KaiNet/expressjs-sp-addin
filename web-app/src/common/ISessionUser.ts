import { IUserModel } from '../models/user';
import { IAuthData } from 'passport-sharepoint-addin';

interface IAppAuthData extends IAuthData {
    shortHandUrl: string;
}

export interface ISessionUser {
    dbUser: IUserModel;
    authData: IAppAuthData;
}
