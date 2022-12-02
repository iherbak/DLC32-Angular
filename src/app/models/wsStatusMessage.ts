import { WsStringMessage } from "./wsStringMessage";

export class WsStatusMessage extends WsStringMessage {

    public state: WsState = WsState.Idle;
    public infoKeyValues!: Map<string, string>;

    constructor(info: string) {
        super();
        var messageType = (info.split("|"))[0].replace('<','').toLowerCase();

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

    }

}

export enum WsState {
    Idle,
    Run,
    Hold
}