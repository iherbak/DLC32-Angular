import { Command } from "./command";
import { CommandType } from "./commandType";

export class EspCommand extends Command {
    constructor(command: string, desc: string, action: 'GET' | 'POST' | 'UPDATE' | 'DELETE' = 'GET', responseType: 'text' | 'json' = 'json') {
        super(command, desc, action, responseType, CommandType.EspCommand);
    }
}