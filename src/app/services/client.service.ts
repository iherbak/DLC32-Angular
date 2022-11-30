import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { ExecutableCommand } from '../models/executableCommand';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public WaitingForClient: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public CommandSuccess: Subject<string> = new Subject();
  public CommandError: Subject<string> = new Subject();

  constructor(private httpClient: HttpClient, private snackBar: SnackBarService) {
  }

  public sendPostCommand(command: ExecutableCommand, payload: any) {
    let config: any = {
      body: payload,
      responseType: 'POST'
    };
    return this.sendCommand(command, config);
  }

  public sendGetCommand(command: ExecutableCommand) {
    let config: any = {
      responseType: 'GET'
    };
    return this.sendCommand(command, config);
  }

  private sendCommand(command: ExecutableCommand, config: any) {
    this.WaitingForClient.next(true);
    let obs: Observable<any>;

    obs = this.httpClient.request(command.httpAction, command.commandUrl, config);

    return obs.pipe(
      tap({
        next: n => {
          this.CommandSuccess.next(`${command.commandUrl} -> OK`);
          this.WaitingForClient.next(false);
        },
        error: e => {
          this.CommandError.next(`${command.commandUrl} ->`);
          this.snackBar.showSnackBar(`${command.commandUrl} failed`);
          this.WaitingForClient.next(false);
        }
      })
    );
  }

}
