import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { ExecutableCommand } from '../models/executableCommand';
import { WsStatusMessage } from '../models/wsStatusMessage';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public WaitingForClient: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public CommandSuccess: Subject<string> = new Subject();
  public WsStatusMessage: Subject<WsStatusMessage> = new Subject();
  public CommandError: Subject<string> = new Subject();
  public Connected: Subject<void> = new Subject();

  constructor(private httpClient: HttpClient) {
  }

  public sendPostCommand<R>(command: ExecutableCommand, payload: any): Observable<R> {
    let config: any = {
      body: payload,
      responseType: command.responseType
    };
    return this.sendCommand<R>(command, config);
  }

  public sendGetCommand<R>(command: ExecutableCommand, backgroundCommand: boolean = false, silent: boolean = false): Observable<R> {
    let config: any = {
      responseType: command.responseType,
      observe: 'body'
    };
    return this.sendCommand<R>(command, config, backgroundCommand, silent);
  }

  private sendCommand<R>(command: ExecutableCommand, config: any, backgroundCommand: boolean = false, silent: boolean = false): Observable<R> {
    if (!backgroundCommand) {
      this.WaitingForClient.next(true);
    }
    let obs: Observable<R>;

    obs = this.httpClient.request<R>(command.httpAction, encodeURI(command.commandUrl), config as object);

    return obs.pipe(
      tap({
        next: n => {
          if (!backgroundCommand || !silent) {
            this.CommandSuccess.next(`${command.commandUrl} -> OK`);
            this.WaitingForClient.next(false);
          }
        },
        error: e => {
          this.CommandError.next(`${command.commandUrl} -> failed`);
          if (!backgroundCommand) {
            this.WaitingForClient.next(false);
          }
        }
      })
    );
  }

}
