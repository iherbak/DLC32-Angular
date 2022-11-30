import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable, Subject, tap } from 'rxjs';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public WaitingForClient: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public CommandSuccess: Subject<string> = new Subject();
  public CommandError: Subject<string> = new Subject();

  constructor(private httpClient: HttpClient, private snackBar: SnackBarService) {
  }

  public sendCommand(commandUrl: string) {
    this.WaitingForClient.next(true);
    let obs = this.httpClient.get(encodeURI(commandUrl)).pipe(
      tap({
        next: n => {
          this.CommandSuccess.next(`${commandUrl} -> OK`);
          this.WaitingForClient.next(false);
        }, 
        error: e => {
          this.CommandError.next(`${commandUrl} ->`);
          this.snackBar.showSnackBar(`${commandUrl} failed`);
          this.WaitingForClient.next(false);
        }
      })
    );
    return obs;
  }

}
