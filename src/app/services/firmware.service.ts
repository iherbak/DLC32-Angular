import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FirmwareInfo } from '../models/firmwareInfo';
import { GrblSetting } from '../models/grblSetting';
import { GrblSettings } from '../models/grblSettings';
import { SettingType } from '../models/settingtype';

@Injectable({
  providedIn: 'root'
})
export class FirmwareService {

  public grblSettings: GrblSetting[] = [
    new GrblSetting("$0", "Step pulse, microseconds", SettingType.Number, "0"),
    new GrblSetting("$1", "Step idle delay, milliseconds", SettingType.Number, "0"),
    new GrblSetting("$2", "Step port invert, mask", SettingType.Mask, "X"),
    new GrblSetting("$3", "Direction port invert, mask", SettingType.Mask, "XYZ"),
    new GrblSetting("$4", "Step enable invert, boolean", SettingType.Bool),
    new GrblSetting("$5", "Limit pins invert, boolean", SettingType.Bool),
    new GrblSetting("$6", "Probe pin invert, boolean", SettingType.Bool),
    new GrblSetting("$10", "Status report, mask", SettingType.Number),
    new GrblSetting("$11", "Junction deviation, mm", SettingType.Number),
    new GrblSetting("$12", "Arc tolerance, mm", SettingType.Number),
    new GrblSetting("$13", "Report inches, boolean", SettingType.Bool),
    new GrblSetting("$20", "Soft limits, boolean", SettingType.Bool),
    new GrblSetting("$21", "Hard limits, boolean", SettingType.Bool),
    new GrblSetting("$22", "Homing cycle, boolean", SettingType.Bool),
    new GrblSetting("$23", "Homing dir invert, mask", SettingType.Mask),
    new GrblSetting("$24", "Homing feed, mm/min", SettingType.Number),
    new GrblSetting("$25", "Homing seek, mm/min", SettingType.Number),
    new GrblSetting("$26", "Homing debounce, milliseconds", SettingType.Number),
    new GrblSetting("$27", "Homing pull-off, mm", SettingType.Number),
    new GrblSetting("$30", "Max spindle speed, RPM", SettingType.Number),
    new GrblSetting("$31", "Min spindle speed, RPM", SettingType.Number),
    new GrblSetting("$32", "Laser mode, boolean", SettingType.Bool),
    new GrblSetting("$100", "X steps/mm", SettingType.Number),
    new GrblSetting("$101", "Y steps/mm", SettingType.Number),
    new GrblSetting("$102", "Z steps/mm", SettingType.Number),
    new GrblSetting("$110", "X Max rate, mm/min", SettingType.Number),
    new GrblSetting("$111", "Y Max rate, mm/min", SettingType.Number),
    new GrblSetting("$112", "Z Max rate, mm/min", SettingType.Number),
    new GrblSetting("$120", "X Acceleration, mm/sec^2", SettingType.Number),
    new GrblSetting("$121", "Y Acceleration, mm/sec^2", SettingType.Number),
    new GrblSetting("$122", "Z Acceleration, mm/sec^2", SettingType.Number),
    new GrblSetting("$130", "X Max travel, mm", SettingType.Number),
    new GrblSetting("$131", "Y Max travel, mm", SettingType.Number),
    new GrblSetting("$132", "Z Max travel, mm", SettingType.Number),
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

  public updateSettings(settings: GrblSettings) {
    settings.Settings.forEach(setting => {
      let grblSetting = this.grblSettings.find(s => s.Name === '$' + setting.Name);
      if (grblSetting != null) {
        grblSetting.Value = setting.Value === "" ? "0" : setting.Value;
      }

    });
  }

}
