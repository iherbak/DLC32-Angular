import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { ExecutableCommand } from '../models/executableCommand';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public WaitingForClient: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public CommandSuccess : Subject<string> = new Subject();
  public CommandError : Subject<string> = new Subject();

  constructor(private httpClient: HttpClient, private snackBar: SnackBarService) { 
  }

  public sendCommand(command: ExecutableCommand) {
    this.WaitingForClient.next(true);
    let obs: Observable<any>;
      switch (command.responseType) {
        case "text": {
          obs = this.httpClient.get(encodeURI(command.commandUrl), { responseType: command.responseType });
          break;
        }
        default: {
          obs = this.httpClient.get(encodeURI(command.commandUrl));
          break;
        }
      };
    let obs.pipe(
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
    return obs;
  }

}
