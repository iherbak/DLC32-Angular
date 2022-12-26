import { WebCommunication } from "./webCommunication";
import { WsStringMessage } from "./wsStringMessage";

export class FirmwareInfo extends WsStringMessage {

    public FW_Version: string = '';
    public FW_Build: string = '';
    public FW_Target: string = '';
    public FW_HW: string = '';
    public Primary_Sd: string = '';
    public Secondary_Sd: string = '';
    public Authentication: string = '';
    public Webcommunication: WebCommunication = new WebCommunication();
    public Axis_Count: number = 0;

    public get WebSocket() {
        return `ws://${this.Webcommunication.Wifi_Ip}:${this.Webcommunication.Websocket_Port}`;
    }

    public get Telnet() {
        return `${this.Webcommunication.Wifi_Ip}:${this.Webcommunication.Telnet_Port}`;
    }

    public clone(infoObject: FirmwareInfo) {
        Object.assign(this, infoObject);
    }
}