import { SettingType } from "./settingtype";

export class GrblSetting{
    public Name : string;
    public Description: string;
    public Value : string;
    public SettingType: SettingType;

    constructor(name: string, description: string, settingType: SettingType, value: string = ""){
        this.Name = name;
        this.Description = description
        this.SettingType = settingType;
        this.Value = value;
    }
}