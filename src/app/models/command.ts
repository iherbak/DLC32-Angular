import { CommandType } from "./commandType";

export class Command {
    public command: string;
    public commandType: CommandType;
    public description: string;
    public responseType: string;

    public get isRawCommand() {
        return this.commandType !== CommandType.FilesGet &&
            this.commandType !== CommandType.FilesAction &&
            this.commandType !== CommandType.Login &&
            this.commandType !== CommandType.UpdateFw;

    }

    constructor(command: string, desc: string, commandType: CommandType = CommandType.Command, responseType: string = 'json') {
        this.commandType = commandType;
        this.command = this.isRawCommand ? command : "";
        this.description = desc;
        this.responseType = responseType;
    }

}
