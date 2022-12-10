export class GrblSetting{
    public Setting : string;
    public Value : number;

    constructor(setting: string, value: number){
        this.Setting = setting;
        this.Value = value;
    }
}