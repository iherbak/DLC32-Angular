import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FirmwareInfo } from '../models/firmwareInfo';
import { GrblSetting } from '../models/grblSetting';

@Injectable({
  providedIn: 'root'
})
export class FirmwareService {

  public grblSettings: GrblSetting[] = [
    new GrblSetting("$0", "Step pulse, microseconds"),
    new GrblSetting("$1", "Step idle delay, milliseconds"),
    new GrblSetting("$2", "Step port invert, mask"),
    new GrblSetting("$3", "Direction port invert, mask"),
    new GrblSetting("$4", "Step enable invert, boolean"),
    new GrblSetting("$5", "Limit pins invert, boolean"),
    new GrblSetting("$6", "Probe pin invert, boolean"),
    new GrblSetting("$10", "Status report, mask"),
    new GrblSetting("$11", "Junction deviation, mm"),
    new GrblSetting("$12", "Arc tolerance, mm"),
    new GrblSetting("$13", "Report inches, boolean"),
    new GrblSetting("$20", "Soft limits, boolean"),
    new GrblSetting("$21", "Hard limits, boolean"),
    new GrblSetting("$22", "Homing cycle, boolean"),
    new GrblSetting("$23", "Homing dir invert, mask"),
    new GrblSetting("$24", "Homing feed, mm/min"),
    new GrblSetting("$25", "Homing seek, mm/min"),
    new GrblSetting("$26", "Homing debounce, milliseconds"),
    new GrblSetting("$27", "Homing pull-off, mm"),
    new GrblSetting("$30", "Max spindle speed, RPM"),
    new GrblSetting("$31", "Min spindle speed, RPM"),
    new GrblSetting("$32", "Laser mode, boolean"),
    new GrblSetting("$100", "X steps/mm"),
    new GrblSetting("$101", "Y steps/mm"),
    new GrblSetting("$102", "Z steps/mm"),
    new GrblSetting("$110", "X Max rate, mm/min"),
    new GrblSetting("$111", "Y Max rate, mm/min"),
    new GrblSetting("$112", "Z Max rate, mm/min"),
    new GrblSetting("$120", "X Acceleration, mm/sec^2"),
    new GrblSetting("$121", "Y Acceleration, mm/sec^2"),
    new GrblSetting("$122", "Z Acceleration, mm/sec^2"),
    new GrblSetting("$130", "X Max travel, mm"),
    new GrblSetting("$131", "Y Max travel, mm"),
    new GrblSetting("$132", "Z Max travel, mm"),
  ];

  private info: FirmwareInfo = new FirmwareInfo();

  public get FirmwareInfo() {
    return this.info;
  }

  public set FirmwareInfo(info: FirmwareInfo) {
    this.info = info;
  }

  public get WebSocketInfo() {
    return this.info.WebSocket;
  }

  public get GrblSettings() {
    return this.grblSettings;
  }

  public setGrblSettingValue(setting: string, value: number) {
    let grblSetting = this.grblSettings.find(s=> s.Setting === setting);
    if(grblSetting != null){
      grblSetting.Value = value;
    }
  }


  constructor() {

  }

}
