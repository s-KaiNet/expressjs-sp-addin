import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as session from 'express-session';
import * as favicon from 'serve-favicon';
import config from './config';
import configurePassport from './passport';
import * as nodeFetch from 'node-fetch';
import fetch from 'node-fetch';
import * as pnp from 'sp-pnp-js';

declare var global: any;

import { Application, Request, Response, NextFunction } from 'express';
import spauth from './sharepoint.auth';

export default class Server {
    public app: Application;

    constructor() {
        this.app = express();

        this.config();
    }

    public static bootstrap(): Server {
        return new Server();
    }

    private config(): void {

        this.app.use(favicon(path.join(__dirname, '../../public', 'favicon.ico')));

        configurePassport(passport);

        (mongoose as any).Promise = global.Promise;
        mongoose.connect(config.dbUrl);

        // view engine setup
        this.app.set('views', path.join(__dirname, '..', 'views'));
        this.app.set('view engine', 'hbs');

        this.app.use(session({
            secret: 'secret', // session secret
            resave: true,
            saveUninitialized: true
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session()); // persistent login sessions

        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../..', 'public')));

        this.configureAuth();
        this.routes();
        this.configurePnP();

        // catch 404 and forward to error handler
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const err: any = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handler
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    private configureAuth(): void {
        spauth(this.app, passport);
    }

    private routes(): void {
        for (const routePath of config.globFiles(config.routes)) {
            const router = require(path.resolve(routePath)).default;
            this.app.use('/:shortUrl', router);
        }
    }

    private configurePnP(): void {
        global.Headers = nodeFetch.Headers;
        global.Request = nodeFetch.Request;
        global.Response = nodeFetch.Response;

        pnp.setup({
            fetchClientFactory: () => {
                return {
                    fetch: (url: string, options: any): Promise<any> => {
                        return fetch(url, options);
                    }
                }
            }
        })
    }
}
