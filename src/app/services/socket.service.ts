import { QueueingSubject } from 'queueing-subject';
import { Injectable } from '@angular/core';
import { interval, map, mergeAll, mergeMap, Observable, retry, share, Subject, Subscription, switchMap, tap } from 'rxjs';
import makeWebSocketObservable, { GetWebSocketResponses, normalClosureMessage } from 'rxjs-websockets';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  //observable for connection
  private socket!: Observable<GetWebSocketResponses<string>>;
  public socketObservable!: Observable<string>;
  //using to transform websocket replies
  public sendMessage: QueueingSubject<string> = new QueueingSubject();

  //create connection
  public createConnection(url: string, port: number) {
    this.sendMessage.next("madafaka");
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


