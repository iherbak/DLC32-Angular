import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Observable, Subject } from 'rxjs';
import { CommandType } from 'src/app/models/commandType';
import { Directory } from 'src/app/models/directory';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-create-directory',
  templateUrl: './create-directory.component.html',
  styleUrls: ['./create-directory.component.less']
})
export class CreateDirectoryComponent {

  public directoryForm: UntypedFormGroup;

  public get nameFc() {
    return this.directoryForm.get('name') as FormControl;
  }

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { currentPath: string, commandType: CommandType }, private _bottomSheetRef: MatBottomSheetRef<CreateDirectoryComponent>, private formBuilder: FormBuilder, private commandService: CommandService, private clientService: ClientService) {
    this.directoryForm = this.formBuilder.group({
      name: ['',[Validators.required]]
    });
  }

  public createDirectory() {
    let command = this.commandService.getCommandUrlByType(this.data.commandType, ["action=createdir", `filename=${this.nameFc.value}`, `path=${this.data.currentPath}`]);
    if (command != null) {
      this.clientService.sendGetCommand<Directory>(command).subscribe({
        next: d => {
          this._bottomSheetRef.dismiss({ success: true, directory: d });
        },
        error: e => {
          this._bottomSheetRef.dismiss({ success: false, directory: null });
        }
      });
    }
  }
}
