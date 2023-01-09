import { KeyValue } from "@angular/common";

export class WsStringMessage {

    public rawMessage : string;

    constructor(rawMessage: string){
        this.rawMessage = rawMessage;
    }
    
    protected getallKeyvalues(sections: string[]): Map<string, string> {
        let keyvalues = new Map();
        if (sections.length > 0) {
            sections.forEach(section => {
                let strippedSection = section.trim();
                let keyValue = strippedSection.split(":");
                if (keyValue.length > 2) {
                    keyvalues.set(keyValue[0], strippedSection.replace(keyValue[0] + ':', ''));
                    let subKEys = this.getallKeyvalues(keyValue[1].split(":"));
                    subKEys.forEach((v, k) => {
                        keyvalues.set(v, k);
                    });
                }
                if (keyValue.length == 2) {
                    keyvalues.set(keyValue[0], keyValue[1]);
                }
            });
        }
        return keyvalues;
    }

}