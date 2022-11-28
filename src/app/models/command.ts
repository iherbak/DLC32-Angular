import { CommandType } from "./commandType";

export class Command {
    public command: string;
    public commandType: CommandType;
    public description: string;

    public get isRawCommand() {
        return this.commandType !== CommandType.FilesGet &&
            this.commandType !== CommandType.FilesAction &&
            this.commandType !== CommandType.Login &&
            this.commandType !== CommandType.UpdateFw;

    }

    constructor(command: string, desc: string, commandType: CommandType = CommandType.Command) {
        this.commandType = commandType;
        this.command = this.isRawCommand ? command : "";
        this.description = desc;
    }

    public getCommandUrl(args: string[]): string {
        let issuedCommand = '';
        switch (this.commandType) {
            case CommandType.Home:
            case CommandType.Move:
            case CommandType.SetOrigin:
            case CommandType.Command: {
                issuedCommand = encodeURI(`/command?commandText=${this.command} ${args.join('&')}`);
                break;
            }
            case CommandType.Jog: {
                issuedCommand = encodeURI(`/command?commandText=${this.command}${args.join('&')}`);
                break;
            }
            case CommandType.CommandSilent: {
                issuedCommand = encodeURI(`/command_silent?commandText=${this.command} ${args.join('&')}`);
                break;
            }
            case CommandType.FilesGet: {
                issuedCommand = "/files";
                break;
            }
            case CommandType.FilesAction: {
                //delete, deletedir, createdir and filename as additional required parameter 
                issuedCommand = encodeURI(`/files?${args.join('&')}`);
                break;
            }
            case CommandType.Login:
                {
                    issuedCommand = "/login";
                    break;
                }
            case CommandType.UpdateFw: {
                issuedCommand = "/updatefw";
                break;
            }
            default:
                issuedCommand = "/"
        }
        console.log(issuedCommand);
        return issuedCommand;
    }
}
