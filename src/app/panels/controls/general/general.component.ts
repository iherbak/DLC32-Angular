import { Component } from '@angular/core';
import { Axis } from 'src/app/models/axis';
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

  constructor(private commandService: CommandService){

  }

  public setOrigin(axes: Axis[]) {
    this.commandService.getSetOriginCommand(axes);
  }

}
