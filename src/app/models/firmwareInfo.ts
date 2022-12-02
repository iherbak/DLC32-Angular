import { KeyValue } from "@angular/common";
import { WsStringMessage } from "./wsStringMessage";

export class FirmwareInfo extends WsStringMessage {

    public infoKeyValues!: Map<string, string>;

    public get SDPaths(): Map<string, string> {
        let result = new Map<string, string>();
        if (this.infoKeyValues.get("primary sd") !== undefined) {
            let value = this.infoKeyValues.get("primary sd");
            if (value !== undefined && value !== "none") {
                result.set("primary sd", value);
            }
        };
        return result;
    }

    public get WebSocket(): string {
        let webcomm = this.infoKeyValues.get("webcommunication");
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


}