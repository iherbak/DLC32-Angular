import { QueueingSubject } from 'queueing-subject';
import { Injectable } from '@angular/core';
import { Observable, retry, share, switchMap, tap } from 'rxjs';
import makeWebSocketObservable, { GetWebSocketResponses, WebSocketOptions } from 'rxjs-websockets';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private textDecoder: TextDecoder = new TextDecoder("utf8");
  //observable for connection
  private socket!: Observable<GetWebSocketResponses<ArrayBuffer>>;
  //an observable to receive messages from websocket connection
  public socketObservable!: Observable<ArrayBuffer>;
  //a subject to send messages through websocket
  public sendMessage: QueueingSubject<ArrayBuffer> = new QueueingSubject();

  constructor(private clientService: ClientService) {

  }

  //create connection
  public createConnection(url: string) {
    //cold observable won't connect until subscription happens
    var config: WebSocketOptions = {
      protocols: ['arduino'],
      makeWebSocket: (url) => {
        console.log('making socket');
        let socket = new WebSocket(url, ['arduino']);
        console.log(socket.protocol);
        console.log(socket.binaryType);
        socket.binaryType = 'arraybuffer';
        console.log(socket.binaryType);
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
            this.clientService.CommandSuccess.next(`WS: ${this.textDecoder.decode(message)}`);
          }
          if(typeof(message) == 'string'){
            this.clientService.CommandSuccess.next(`WS: ${message}`);
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


