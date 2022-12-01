import { __values } from "tslib";

export class FirmwareInfo {

    public infoKeyValues!: KeyValue[];

    public get SDPath(): KeyValue | undefined {
        return this.infoKeyValues.find(kv => kv.key === "primary sd");
    }

    public get WebSocket(): string {
        let webcomm = this.infoKeyValues.find(kv => kv.key === "webcommunication")?.value;
        let parts = webcomm?.split(":");
        if (parts && parts?.length > 1) {
            return `ws://${parts[2].trim()}:${parts[1].trim()}`;
        }
        return "";
    }

    //FW version:1.1 (2022010501) # FW target:grbl-embedded  # FW HW:Direct SD  # primary sd:/sd # secondary sd:none # authentication:no # webcommunication: Sync: 81:10.0.4.125 # hostname:grblesp # axis:3\r\n

    public parseInfo(info: string) {
        this.infoKeyValues = this.getallKeyvalues(info.split("#"));
    }

    private getallKeyvalues(sections: string[]): KeyValue[] {
        let keyvalues: KeyValue[] = [];
        if (sections.length > 0) {
            sections.forEach(section => {
                let strippedSection = section.trim();
                let keyValue = strippedSection.split(":");
                if (keyValue.length > 2) {
                    keyvalues.push(new KeyValue(keyValue[0], strippedSection.replace(keyValue[0] + ':', '')));
                    let subKEys = this.getallKeyvalues(keyValue[1].split(":"));
                    keyvalues = keyvalues.concat(subKEys)
                }
                if (keyValue.length == 2) {
                    keyvalues.push(new KeyValue(keyValue[0], keyValue[1]));
                }
            });
        }
        return keyvalues;
    }

}

export class KeyValue {
    public key: string;
    public value: string;
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}