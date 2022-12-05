import { CommandType } from "./commandType";

export class Command {
    public command: string;
    public commandType: CommandType;
    public description: string;
    public responseType: string;
    public httpAction:  'GET' | 'POST' | 'UPDATE' | 'DELETE';

    public get isRawCommand() {
        return this.commandType !== CommandType.Upload &&
            this.commandType !== CommandType.FilesAction &&
            this.commandType !== CommandType.Login &&
            this.commandType !== CommandType.UpdateFw;

    }

    constructor(command: string, desc: string, action : 'GET' | 'POST' | 'UPDATE' | 'DELETE' = 'GET', responseType: 'text' | 'json' = 'json', commandType: CommandType = CommandType.Command) {
        this.commandType = commandType;
        this.command = this.isRawCommand ? command : "";
        this.description = desc;
        this.responseType = responseType;
        this.httpAction = action;
    }

}
