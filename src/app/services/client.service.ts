import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, last, map, Observable, ObservableInput, of, Subject, switchMap, tap } from 'rxjs';
import { ExecutableCommand } from '../models/executableCommand';
import { ShowProgress } from '../models/showProgress';
import { WsStatusMessage } from '../models/wsStatusMessage';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public WaitingForClient: BehaviorSubject<ShowProgress> = new BehaviorSubject(new ShowProgress());
  public CommandSuccess: Subject<string> = new Subject();
  public WsStatusMessage: Subject<WsStatusMessage> = new Subject();
  public CommandError: Subject<string> = new Subject();
  public Connected: Subject<void> = new Subject();

  constructor(private httpClient: HttpClient) {
  }

  public sendPostCommand<R>(command: ExecutableCommand, payload: any): Observable<R> {
    let config: any = {
      body: payload,
      responseType: command.responseType,
      reportProgress: true,
      observe: 'events'
    };
    return this.sendObservableCommand<R>(command, config);
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
      this.WaitingForClient.next(new ShowProgress());
    }
    let obs: Observable<R>;

    obs = this.httpClient.request<R>(command.httpAction, encodeURI(command.commandUrl), config as object);

    return obs.pipe(
      tap({
        next: n => {
          if (!backgroundCommand || !silent) {
            this.CommandSuccess.next(`${command.commandUrl} -> OK`);
            this.WaitingForClient.next(new ShowProgress(false));
          }
        },
        error: e => {
          this.CommandError.next(`${command.commandUrl} -> failed`);
          if (!backgroundCommand) {
            this.WaitingForClient.next(new ShowProgress(false));
          }
        }
      })
    );
  }

  private sendObservableCommand<R>(command: ExecutableCommand, config: any, backgroundCommand: boolean = false): Observable<R> {
    if (!backgroundCommand) {
      this.WaitingForClient.next(new ShowProgress(true, false, 0));
    }
    let obs: Observable<HttpEvent<any>>;

    obs = this.httpClient.request<HttpEvent<any>>(command.httpAction, encodeURI(command.commandUrl), config as object);

    return obs.pipe(
      map(event => this.getEventMessage(event)),
      last(),
      catchError((err, caught) => this.handleError(err, caught))
    );
  }

  handleError<R>(err: any, caught: Observable<R>): Observable<R> {
    this.WaitingForClient.next(new ShowProgress(false));
    return caught;
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        {
          const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          this.WaitingForClient.next(new ShowProgress(true, false, percentDone));
          return;
        }

      case HttpEventType.Response:
        {
          this.WaitingForClient.next(new ShowProgress(false, false, 0));
          return event.body;
        }
    }
  }

}
