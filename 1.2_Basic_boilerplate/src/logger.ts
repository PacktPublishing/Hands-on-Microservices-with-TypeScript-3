
export enum LogLevelEnum {
	debug,
	info,
	warn,
	error,
}

export class Logger {

	public logLevel: LogLevelEnum;
	constructor(logLevel: string) {
		let theLogLevel = LogLevelEnum[logLevel];
		this.logLevel = theLogLevel;
	}

	private getDate(): string {
		let date = new Date();
		let dStr = date.toLocaleDateString() + " " + date.toLocaleTimeString();
		return dStr;
	}
	public debug(fmt: string, ...additions): void {
		if (this.logLevel > LogLevelEnum.debug) { return; }
		console.debug(this.getDate() + " [Debug] " + fmt, ...additions);
	}
	public info(fmt: string, ...additions): void {
		if (this.logLevel > LogLevelEnum.info) { return; }

		console.info(this.getDate() + " [Info] " + fmt, ...additions);
	}
	public warn(fmt: string, ...additions): void {
		if (this.logLevel > LogLevelEnum.warn) { return; }

		console.warn(this.getDate() + " [Warn ] " + fmt, ...additions);
	}
	public error(fmt: string, ...additions): void {
		if (this.logLevel > LogLevelEnum.error) { return; }

		console.error(this.getDate() + " [Error] " + fmt, ...additions);
	}
}