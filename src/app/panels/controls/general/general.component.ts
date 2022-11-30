import { Component } from '@angular/core';
import { Axis } from 'src/app/models/axis';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.less']
})
export class GeneralComponent {

  public get Axes()
  {
    return Axis;
  }

  constructor(private commandService: CommandService, private clientServce: ClientService){

  }

  public setOrigin(axes: Axis[]) {
    let command = this.commandService.getSetOriginCommand(axes);
    this.clientServce.sendGetCommand(command);
  }

}
