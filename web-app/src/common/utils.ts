export default class Utils {
    public static ensureTrailingSlash(url: string): string {
        if (!url.endsWith('/')) {
            return url + '/';
        }

        return url;
    }
}
