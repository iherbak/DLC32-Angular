import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GrblSetting } from 'src/app/models/grblSetting';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { FirmwareService } from 'src/app/services/firmware.service';

@Component({
  selector: 'app-grblsheet',
  templateUrl: './grblsheet.component.html',
  styleUrls: ['./grblsheet.component.less']
})
export class GrblsheetComponent implements OnDestroy, AfterViewInit {

  private unsub: Subject<void> = new Subject();
  public grblSettingsForm!: UntypedFormGroup;

  public get grblArray() {
    return this.grblSettingsForm.get('settings') as FormArray<FormControl>;
  }

  constructor(private clientService: ClientService, private commandService: CommandService, private firmwareService: FirmwareService, private formBuilder: FormBuilder) {
    this.grblSettingsForm = this.formBuilder.group({
      settings: this.formBuilder.array([])
    });
  }

  public GetSettingName(i: number) {
    return this.firmwareService.GrblSettings[i].Setting;
  }

  public GetSettingDescription(i: number) {
    return this.firmwareService.GrblSettings[i].Description;
  }

  public HasRequiredError(i: number) {
    return this.grblArray.at(i).hasError('required');
  }

  ngAfterViewInit(): void {
    this.firmwareService.GrblSettings.forEach(setting => {
      let settingControl: FormControl = new FormControl(setting.Value, [Validators.required]);
      this.grblArray.push(settingControl);
    });

  }

  public setGrblValue(i: number) {
    let control = this.grblArray.at(i);
    if (control.valid) {
      let command = this.commandService.getCommandUrlByCommand(`${this.GetSettingName(i)}=`, [control.value]);
      if (command != null) {
        this.clientService.sendGetCommand(command).subscribe();
      }
    }
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
