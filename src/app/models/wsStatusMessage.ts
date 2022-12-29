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
        this.infoKeyValues = this.getallKeyvalues(info.replace('<', '').replace('>', '').split("|"));
        let messageType = this.infoKeyValues.get("State");
        if (messageType != null) {
            if (messageType === "Run") {
                this.state = WsState.Run;
            }
            if (messageType === 'Idle') {
                this.state = WsState.Idle;
            }
            if (messageType === 'Hold') {
                this.state = WsState.Hold;
            }
            if (messageType === 'Alarm') {
                this.state = WsState.Alarm;
            }
            if(messageType === "Unknown"){
                this.state = WsState.Unknown;
            }
            if(messageType === "Home"){
                this.state = WsState.Home;
            }
        }

    }

}

export enum WsState {
    Idle,
    Run,
    Hold,
    Alarm,
    Unknown,
    Home
}