import { SettingBase } from "./settingBase";
import { SettingType } from "./settingtype";

export class GrblSetting extends SettingBase{
   
    public SettingType: SettingType;

    constructor(name: string, description: string, settingType: SettingType, value: string = ""){
        super(name,description,value);
        this.SettingType = settingType;
    }
}