export class SettingBase {
    public Name : string;
    public Description: string;
    public Value : string;

    constructor(name: string, description: string, value: string = ""){
        this.Name = name;
        this.Description = description
        this.Value = value;
    }
}