import { ESP32File } from "./esp32file";

export class Directory {
    public files: ESP32File[];
    public path!: string;
    public status!: string;
    public total!: string;
    public used!: string;

    constructor()
    {
        this.files = [];
    }
    
}