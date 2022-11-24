export class Command {
    public command: string;
    public description: string;
    constructor(command: string, desc: string) {
        this.command = command;
        this.description = desc;
    }
}