import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AxisMask } from 'src/app/models/axisMask';
import { GrblSetting } from 'src/app/models/grblSetting';
import { SettingType } from 'src/app/models/settingtype';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { FirmwareService } from 'src/app/services/firmware.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-grblsheet',
  templateUrl: './grblsheet.component.html',
  styleUrls: ['./grblsheet.component.less']
})
export class GrblsheetComponent implements OnInit {

  public grblSettingsForm!: UntypedFormGroup;

  public get SettingTypes() {
    return SettingType;
  }
  public get AxisMasks() {
    return AxisMask;
  }

  public get grblArray() {
    return this.grblSettingsForm.get('settings') as FormArray<FormControl>;
  }

  constructor(private clientService: ClientService, private commandService: CommandService, private firmwareService: FirmwareService, private formBuilder: FormBuilder, public bottomSheetRef: MatBottomSheetRef<GrblsheetComponent>, private snackBar: SnackBarService) {
    this.grblSettingsForm = this.formBuilder.group({
      settings: this.formBuilder.array([])
    });

  }
  ngOnInit(): void {
    this.updateFormArray(this.firmwareService.GrblSettings);
  }

  private updateSettings() {
    this.firmwareService.fetchGrblSettings().subscribe({
      next: (settings) => { this.updateFormArray(settings) },
      error: () => { this.snackBar.showSnackBar("GRBL settings fetch failure"); }
    });
  }

  getAxisMask(value: string): any {
    switch (value) {
      case 'X': {
        return AxisMask.X;
      }
      case 'Y': {
        return AxisMask.Y;
      }
      case 'Z': {
        return AxisMask.Z;
      }
      case 'XY': {
        return AxisMask.XY;
      }
      case 'XZ': {
        return AxisMask.XZ;
      }
      case 'YZ': {
        return AxisMask.YZ;
      }
      case 'XYZ': {
        return AxisMask.XYZ;
      }
      default:
        return AxisMask.None;
    }
  }

  private updateFormArray(settings: GrblSetting[]) {
    this.grblArray.clear();
    settings.forEach(setting => {
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
        case SettingType.Mask: {
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
      this.firmwareService.setGrblValue(i, control.value).subscribe((settings) => {
        this.updateFormArray(settings);
      });
    }
  }
}
