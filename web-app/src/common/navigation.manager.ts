import { Host, IHostModel } from './../models/host';
import * as crypto from 'crypto';
import utils from './utils';

export default class NavigationManager {

    public getHostByShortHandUrl(shortUrl: string): Promise<IHostModel> {
       return Host
            .findOne({ shortHandUrl: shortUrl })
            .then(d => {
                return d;
            });
    }

    public getHostByUrl(url: string): Promise<IHostModel> {
        const hostUrl = utils.ensureTrailingSlash(url);

        return Promise.all([Host.find(), Host.findOne({ 'url': hostUrl })])
            .then((data) => {
                const allHosts: string[] = data[0].map(host => {
                    return host.shortHandUrl;
                });
                const currentHost: IHostModel = data[1];

                if (!currentHost) {

                    let shortHandUrl: string = this.getRandomString();
                    while (allHosts.indexOf(shortHandUrl) >= 0) {
                        shortHandUrl = this.getRandomString();
                    }

                    const host: IHostModel = new Host({
                        url: hostUrl,
                        hash: this.getHash(hostUrl),
                        shortHandUrl: this.getRandomString()
                    } as IHostModel);
                    return host.save();
                } else {
                    return currentHost;
                }
            });
    }

    private getRandomString(): string {
        let text: string = '';
        const possible: string = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private getHash(data: string): string {
        return crypto.createHash('md5').update(data).digest('hex');
    }
}
