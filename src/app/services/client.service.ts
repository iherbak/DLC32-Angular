import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommandType } from '../models/commandType';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public WaitingForClient: Subject<boolean> = new Subject();

  constructor(private httpClient: HttpClient) { }

  public sendCommand(command: string) {
    this.WaitingForClient.next(true);
    let result = this.httpClient.get(command);
    //this.WaitingForClient.next(false);
  }

}
