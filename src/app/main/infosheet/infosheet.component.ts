import { Component } from '@angular/core';
import { CommandType } from 'src/app/models/commandType';
import { FirmwareInfo } from 'src/app/models/firmwareInfo';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { FirmwareService } from 'src/app/services/firmware.service';

@Component({
  selector: 'app-infosheet',
  templateUrl: './infosheet.component.html',
  styleUrls: ['./infosheet.component.less']
})
export class InfosheetComponent {

  public get firmwareInfo(){
    return this.firmware.FirmwareInfo.infoKeyValues;
  }
  
  constructor(private firmware: FirmwareService) {
  }


}
