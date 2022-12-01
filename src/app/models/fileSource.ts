export class FileSource {
    public Name: string;
    public Drive: Drive;

    constructor(name: string, drive: Drive) {
        this.Name = name;
        this.Drive = drive;
    }
}

export enum Drive {
    SPIFF,
    SD
}