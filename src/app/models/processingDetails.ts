export class ProcessingDetails{
    public FilePath!: string;
    public Percentage: number;

    constructor(filePath: string, percentage: number){
        this.FilePath = filePath;
        this.Percentage = percentage;
    }
}