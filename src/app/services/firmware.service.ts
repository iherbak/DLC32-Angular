import { Injectable } from '@angular/core';
import { FirmwareInfo } from '../models/firmwareInfo';

@Injectable({
  providedIn: 'root'
})
export class FirmwareService {

  private info: FirmwareInfo = new FirmwareInfo();

  public get FirmwareInfo() {
    return this.info;
  }

  public set FirmwareInfo(info: FirmwareInfo) {
    this.info = info;
  }

  constructor() { 

  }

}
