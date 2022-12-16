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

    public clone(infoObject: FirmwareInfo){
        Object.assign(this,infoObject);
    }

    // example response 
    //FW version:1.1h (2022110102) # FW target:grbl-embedded # FW HW:Direct SD # primary sd:/sd # secondary sd:none # authentication:no # webcommunication: Sync: 81:10.0.4.119 # hostname:mks_grbl # axis:3
    public parseStringFWInfo(info: string) {
        let parts = info.split("#");
        parts.forEach(part => {
            let keyValue = part.split(":");
            switch (keyValue[0].trim()) {
                case "FW version": {
                    this.FW_Version = keyValue[1].trim();
                    break;
                }
                case "FW target": {
                    this.FW_Target = keyValue[1].trim();
                    break;
                }
                case "FW HW": {
                    this.FW_HW = keyValue[1].trim();
                    break;
                }
                case "primary sd": {
                    this.Primary_Sd = keyValue[1].trim();
                    break;
                }
                case "secondary sd": {
                    this.Secondary_Sd = keyValue[1].trim();
                    break;
                }
                case "authentication": {
                    this.Authentication = keyValue[1].trim();
                    break;
                }
                case "hostname": {
                    this.Webcommunication.Hostname = keyValue[1].trim();
                    break;
                }
                case "axis": {
                    this.Axis_Count = parseInt(keyValue[1].trim());
                    break;
                }
                case "webcommunication": {
                    if (keyValue.length > 3) {
                        this.Webcommunication.Wifi_Ip = keyValue[3].trim();
                    }

                    if (keyValue.length > 2) {
                        this.Webcommunication.Websocket_Port = parseInt(keyValue[2].trim());
                    }
                    this.Webcommunication.Mode = keyValue[1].trim();
                    break;
                }
            }
        });
    }
}

export class WebCommunication {
    public Mode: string = '';
    public Websocket_Port: number = 0;
    public Wifi_Ip: string = '';
    public Hostname: string = '';
    public Wifi_Mode: string = '';
}