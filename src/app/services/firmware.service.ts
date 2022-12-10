import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FirmwareInfo } from '../models/firmwareInfo';
import { GrblSetting } from '../models/grblSetting';

@Injectable({
  providedIn: 'root'
})
export class FirmwareService {

  public GrblSettingsChanges : Subject<void> = new Subject();

  private info: FirmwareInfo = new FirmwareInfo();
  private grblSettings: GrblSetting[] = [];

  public get FirmwareInfo() {
    return this.info;
  }

  public set FirmwareInfo(info: FirmwareInfo) {
    this.info = info;
  }

  public get WebSocketInfo(){
    return this.info.WebSocket;
  }

  public get GrblSettings(){
    return this.grblSettings;
  }

  public set GrblSettings(settings: GrblSetting[]){
    this.grblSettings = settings;
    this.GrblSettingsChanges.next();
  }


  constructor() { 

  }

}
