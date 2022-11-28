import { Component } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Axis } from 'src/app/models/axis';
import { Direction } from 'src/app/models/direction';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-xyz',
  templateUrl: './xyz.component.html',
  styleUrls: ['./xyz.component.less']
})
export class XyzComponent {

  public distanceForm: FormGroup;

  public get distanceFc() {
    return this.distanceForm.get('distanceInput') as FormControl;
  }

  public get axisFc() {
    return this.distanceForm.get('axisInput') as FormControl;
  }

  constructor(private commandService: CommandService, formBuilder: UntypedFormBuilder, private clientService: ClientService) {

    this.distanceForm = formBuilder.group({
      distanceInput: ["0.1"],
      axisInput: ['XY']
    });

  }

  public get Axes() {
    return Axis;
  };

  public get Directions() {
    return Direction;
  };

  public move(axis: Axis, direction: Direction = Direction.PLUS) {
    let distance = this.distanceFc.value;
    this.commandService.getJogCommand(axis, direction === Direction.MINUS ? -distance : distance);
  }

  public home() {
    let command = this.commandService.getHomeCommand();
    if (command !== undefined) {
      this.clientService.sendCommand(command);
    }
  }

}
