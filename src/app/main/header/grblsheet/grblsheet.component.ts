import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AxisMask } from 'src/app/models/axisMask';
import { CommandType } from 'src/app/models/commandType';
import { GrblSettings } from 'src/app/models/grblSettings';
import { SettingType } from 'src/app/models/settingtype';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { FirmwareService } from 'src/app/services/firmware.service';

@Component({
  selector: 'app-grblsheet',
  templateUrl: './grblsheet.component.html',
  styleUrls: ['./grblsheet.component.less']
})
export class GrblsheetComponent implements OnDestroy, OnInit {

  private unsub: Subject<void> = new Subject();
  public grblSettingsForm!: UntypedFormGroup;

  public get SettingTypes() {
    return SettingType;
  }
  public get AxisMasks(){
    return AxisMask;
  }

  public get grblArray() {
    return this.grblSettingsForm.get('settings') as FormArray<FormControl>;
  }

  constructor(private clientService: ClientService, private commandService: CommandService, private firmwareService: FirmwareService, private formBuilder: FormBuilder) {
    this.grblSettingsForm = this.formBuilder.group({
      settings: this.formBuilder.array([])
    });

  }
  ngOnInit(): void {
    this.refreshSettings();
  }

  getAxisMask(value: string): any {
    switch(value){
      case 'X':{
        return AxisMask.X;
      }
      case 'Y':{
        return AxisMask.Y;
      }
      case 'Z':{
        return AxisMask.Z;
      }
      case 'XY':{
        return AxisMask.XY;
      }
      case 'XZ':{
        return AxisMask.XZ;
      }
      case 'YZ':{
        return AxisMask.YZ;
      }
      case 'XYZ':{
        return AxisMask.XYZ;
      }
      default:
        return AxisMask.None;
    }
  }

  private refreshSettings() {
    let basecommand = this.commandService.getEspApiCommand(CommandType.GrblSettings);
    if (basecommand != null) {
      this.clientService.sendGetCommand<GrblSettings>(basecommand).subscribe((settings) => {
        this.firmwareService.updateSettings(settings);
        this.updateFormArray();
      });
    }
  }

  private updateFormArray(){
    this.grblArray.clear();
    this.firmwareService.GrblSettings.forEach(setting => {
      let settingControl: FormControl;
      switch (setting.SettingType) {
        case SettingType.Number: {
          settingControl = new FormControl(parseFloat(setting.Value), [Validators.required]);
          break;
        }
        case SettingType.Bool: {
          settingControl = new FormControl(setting.Value === "Off" ? false : true, [Validators.required]);
          break;
        }
        case SettingType.Mask:{
          settingControl = new FormControl(this.getAxisMask(setting.Value), [Validators.required]);
          break;
        }
        default: {
          settingControl = new FormControl(setting.Value, [Validators.required]);
          break;
        }
      }
      this.grblArray.push(settingControl);
    });
  }

  public GetSettingName(i: number) {
    return this.firmwareService.GrblSettings[i].Name;
  }

  public GetSettingDescription(i: number) {
    return this.firmwareService.GrblSettings[i].Description;
  }

  public GetSettingType(i: number) {
    return this.firmwareService.GrblSettings[i].SettingType;
  }

  public HasRequiredError(i: number) {
    return this.grblArray.at(i).hasError('required');
  }


  public setGrblValue(i: number) {
    let control = this.grblArray.at(i);
    if (control.valid) {
      let command = this.commandService.getCommandUrlByCommand(`${this.GetSettingName(i)}=`, [control.value]);
      if (command != null) {
        this.clientService.sendGetCommand(command).subscribe(() => {
          this.refreshSettings();
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
