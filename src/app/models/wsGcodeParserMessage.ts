import { WsStringMessage } from "./wsStringMessage";

export class WsGcodeParserMessage extends WsStringMessage{

    public ParserIndicatesLaserOn: boolean = false;
    constructor(rawMessage: string, laserState: boolean){
        super(rawMessage);
        this.ParserIndicatesLaserOn = laserState;
    }
}