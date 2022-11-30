import { QueueingSubject } from 'queueing-subject';
import { Injectable } from '@angular/core';
import { Observable, retry, share, switchMap, tap } from 'rxjs';
import makeWebSocketObservable, { GetWebSocketResponses } from 'rxjs-websockets';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  //observable for connection
  private socket!: Observable<GetWebSocketResponses<string>>;
  //an observable to receive messages from websocket connection
  public socketObservable!: Observable<string>;
  //a subject to send messages through websocket
  public sendMessage: QueueingSubject<string> = new QueueingSubject();

  //create connection
  public createConnection(url: string, port: number) {
    //cold observable won't connect until subscription happens
    this.socket = makeWebSocketObservable<string>(`${url}:${port}`);

    this.socketObservable = this.socket.pipe(
      switchMap((getResponse: GetWebSocketResponses<string>)=>{
        return getResponse(this.sendMessage);
      }),
      tap({
        next: (message: string) => {
          console.log('Websocket message:', message);
        },
        error: (error: Error) => {
          console.log('Websocket error:', error)
        },
      }),
      retry({ count: 5, delay: 1000, resetOnSuccess: true }),
      share()
    );
  }
}


