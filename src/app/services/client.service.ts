import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public WaitingForClient: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public CommandSuccess : Subject<string> = new Subject();
  public CommandError : Subject<string> = new Subject();

  constructor(private httpClient: HttpClient, private snackBar: SnackBarService) { 
  }

  public sendCommand(commandUrl: string) {
    this.WaitingForClient.next(true);
    let obs =  this.httpClient.get(encodeURI(commandUrl));
    obs.subscribe({
      next: (success : any) => {
        this.CommandSuccess.next(`${commandUrl} -> ${success.status}`);
        this.WaitingForClient.next(false);
      },
      error: (error : any) => {
        this.CommandError.next(`${commandUrl} -> ${error.status}`);
        this.snackBar.showSnackBar(`${commandUrl} failed`);
        this.WaitingForClient.next(false);
      }
    });
    return obs;
  }

}
