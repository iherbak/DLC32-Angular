import { ProcessingDetails } from "./processingDetails";
import { WsStringMessage } from "./wsStringMessage";

export class WsStatusMessage extends WsStringMessage {

    public state: WsState = WsState.Idle;
    public infoKeyValues!: Map<string, string>;

    public getProcessingDetails(): ProcessingDetails {
        let result = new ProcessingDetails("", 0);

        let progress = this.infoKeyValues.get("SD");
        if (progress != undefined) {
            let sdMessageParts = progress.split(",");
            result.FilePath = sdMessageParts[1];
            result.Percentage = parseFloat(sdMessageParts[0]);
        }
        return result;
    }
    constructor(info: string) {
        super();
        var messageType = (info.split("|"))[0].replace('<', '').toLowerCase();

        this.infoKeyValues = this.getallKeyvalues(info.replace('<', '').replace('>', '').split("|"));

        if (messageType.includes("run")) {
            this.state = WsState.Run;
        }
        if (messageType.includes('idle')) {
            this.state = WsState.Idle;
        }
        if (messageType.includes('hold')) {
            this.state = WsState.Hold;
        }
        if (messageType.includes('alarm')) {
            this.state = WsState.Alarm;
        }

    }

}

export enum WsState {
    Idle,
    Run,
    Hold,
    Alarm
}