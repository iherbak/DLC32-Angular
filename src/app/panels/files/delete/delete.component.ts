import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CommandType } from 'src/app/models/commandType';
import { Directory } from 'src/app/models/directory';
import { ESP32File } from 'src/app/models/esp32file';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.less']
})
export class DeleteComponent {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { currentPath: string, file: ESP32File, commandType: CommandType }, private _bottomSheetRef: MatBottomSheetRef<DeleteComponent>, private commandService: CommandService, private clientService: ClientService) {

  }

  public delete() {
    let command = this.commandService.getEspApiCommand(this.data.commandType, [`action=${this.data.file.size === "-1" ? "deletedir" : "delete"}`, `filename=${this.data.file.name}`, `path=${this.data.currentPath}`]);
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
