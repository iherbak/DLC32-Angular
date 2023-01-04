import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { EspSetting } from 'src/app/models/espSetting';
import { FirmwareService } from 'src/app/services/firmware.service';

@Component({
  selector: 'app-espsheet',
  templateUrl: './espsheet.component.html',
  styleUrls: ['./espsheet.component.less']
})
export class EspsheetComponent implements OnInit {

  public espSettingsForm!: UntypedFormGroup;

  public get espArray() {
    return this.espSettingsForm.get('settings') as FormArray<FormControl>;
  }

  ngOnInit(): void {
    this.updateFormArray(this.firmwareService.EspSettings);
  }

  constructor(private firmwareService: FirmwareService, private formBuilder: FormBuilder, public bottomSheetRef: MatBottomSheetRef<EspsheetComponent>) {
    this.espSettingsForm = this.formBuilder.group({
      settings: this.formBuilder.array([])
    });
  }

  public GetSettingDescription(i: number) {
    return this.firmwareService.EspSettings[i].Description;
  }

  public GetSettingName(i: number) {
    return this.firmwareService.EspSettings[i].Name;
  }

  private updateFormArray(settings: EspSetting[]) {
    this.espArray.clear();
    settings.forEach(setting => {
      let settingControl = new FormControl(setting.Value, [Validators.required]);
      this.espArray.push(settingControl);
    });
  }

  public setEspValue(i: number) {
    let control = this.espArray.at(i);
    if (control.valid) {
      this.firmwareService.setEspValue(i, control.value).subscribe((settings) => {
        this.updateFormArray(settings);
      });
    }
  }
}
