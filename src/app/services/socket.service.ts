import { QueueingSubject } from 'queueing-subject';
import { Injectable } from '@angular/core';
import { Observable, retry, share, switchMap, tap } from 'rxjs';
import makeWebSocketObservable, { GetWebSocketResponses, WebSocketOptions } from 'rxjs-websockets';
import { ClientService } from './client.service';
import { WsState, WsStatusMessage } from '../models/wsStatusMessage';
import { AlarmCode } from '../models/alarmCode';
import { GrblSetting } from '../models/grblSetting';
import { FirmwareService } from './firmware.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private alarmCodes: AlarmCode[] = [
    new AlarmCode("1", "Hard limit has been triggered. Machine position is likely lost due to sudden halt. Re-homing is highly recommended."),
    new AlarmCode("2", "Soft limit alarm. G-code motion target exceeds machine travel. Machine position retained. Alarm may be safely unlocked."),
    new AlarmCode("3", "Reset while in motion. Machine position is likely lost due to sudden halt. Re-homing is highly recommended."),
    new AlarmCode("4", "Probe fail. Probe is not in the expected initial state before starting probe cycle when G38.2 and G38.3 is not triggered and G38.4 and G38.5 is triggered."),
    new AlarmCode("5", "Probe fail. Probe did not contact the workpiece within the programmed travel for G38.2 and G38.4."),
    new AlarmCode("6", "Homing fail. The active homing cycle was reset."),
    new AlarmCode("7", "Homing fail. Safety door was opened during homing cycle."),
    new AlarmCode("8", "Homing fail. Pull off travel failed to clear limit switch. Try increasing pull-off setting or check wiring."),
    new AlarmCode("9", "Homing fail. Could not find limit switch within search distances. Try increasing max travel, decreasing pull-off distance, or check wiring.")
  ];

  private textDecoder: TextDecoder = new TextDecoder("utf8");
  //observable for connection
  private socket!: Observable<GetWebSocketResponses<ArrayBuffer>>;
  //an observable to receive messages from websocket connection
  public socketObservable!: Observable<ArrayBuffer>;
  //a subject to send messages through websocket
  public sendMessage: QueueingSubject<ArrayBuffer> = new QueueingSubject();

  private machineState: WsState = WsState.Idle

  public get MachineState() {
    return this.machineState;
  }

  public get isRunning() {
    return (this.machineState === WsState.Run || this.machineState === WsState.Hold);
  }

  constructor(private clientService: ClientService, private firmwareService: FirmwareService) {

  }

  //create connection
  public createConnection(url: string) {
    //cold observable won't connect until subscription happens
    var config: WebSocketOptions = {
      protocols: ['arduino'],
      makeWebSocket: (url) => {
        let socket = new WebSocket(url, ['arduino']);
        socket.binaryType = 'arraybuffer';
        return socket;
      }
    }
    this.socket = makeWebSocketObservable<ArrayBuffer>(`${url}`, config);

    this.socketObservable = this.socket.pipe(
      switchMap((getResponse: GetWebSocketResponses<ArrayBuffer>) => {
        return getResponse(this.sendMessage);
      }),
      tap({
        next: (message: any) => {
          if (message instanceof ArrayBuffer) {
            let strMessage = this.textDecoder.decode(message);
            //it is a status message
            if (strMessage.startsWith('<')) {
              let wsMessage = new WsStatusMessage(strMessage);
              //set state change
              if (this.machineState !== wsMessage.state) {
                this.machineState = wsMessage.state;
              }

              if (wsMessage.state == WsState.Alarm) {
                let alarmdesc = this.alarmCodes.find(ac => ac.code == wsMessage.infoKeyValues.get("ALARM"));
                if (alarmdesc != null) {
                  wsMessage.infoKeyValues.set("alarm", alarmdesc?.description);
                }
                else {
                  wsMessage.infoKeyValues.set("alarm", "unknown");
                }
              }
              this.clientService.WsStatusMessage.next(wsMessage);
            }
            if (strMessage.startsWith('$')) {
              let lines = strMessage.split("\n");
              let grblSettings: GrblSetting[] = [];
              lines.forEach(line => {
                // do not parse ok message at the end
                if (line.startsWith('$')) {
                  let grblsetting = line.split("=");
                  grblSettings.push(new GrblSetting(grblsetting[0].trim(), parseFloat(grblsetting[1].trim())));
                }
              });
              this.firmwareService.GrblSettings = grblSettings;
            }
            this.clientService.CommandSuccess.next(strMessage);
          }
          if (typeof (message) == 'string') {

            this.clientService.CommandSuccess.next(message);
          }
        },
        error: (error) => {
          this.clientService.CommandError.next(`WS: ${error}`);
          console.log('Websocket error:', error)
        },
      }),
      retry({ count: 2, delay: 1000, resetOnSuccess: true }),
      share()
    );
  }
}


