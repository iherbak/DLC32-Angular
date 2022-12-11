export class GrblSetting{
    public Setting : string;
    public Description: string;
    public Value : number;

    constructor(setting: string, description: string, value: number = 0){
        this.Setting = setting;
        this.Description = description
        this.Value = value;
    }
}