import { sync } from 'glob';

export default class Config {
	public static routes: string = './src/routes/**/*.ts';
	public static dbUrl: string = 'localhost:27017/node-auth-test';
	public static appUrl: string = 'https://localhost:44355';

	public static globFiles(location: string): Array<string> {
		return sync(location);
	}
}
