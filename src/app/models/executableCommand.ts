export class ExecutableCommand {
    public commandUrl: string;
    public responseType: string;
    public httpAction: 'GET' | 'POST' | 'UPDATE' | 'DELETE';

    constructor(commandUrl: string, action: 'GET' | 'POST' | 'UPDATE' | 'DELETE' = "GET", responseType: string = "json") {
        this.commandUrl = commandUrl;
        this.responseType = responseType
        this.httpAction = action;
    }
}