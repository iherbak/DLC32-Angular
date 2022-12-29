import { Component } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Axis } from 'src/app/models/axis';
import { Direction } from 'src/app/models/direction';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { FirmwareService } from 'src/app/services/firmware.service';

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

  public get feedRateFc() {
    return this.distanceForm.get('feedRate') as FormControl;
  }

  public get hardLimitEnabled(){
    return this.firmwareService.GrblSettings.find(s=> s.Name == "$21")?.Value === "Off" ? false : true;
  }

  constructor(private commandService: CommandService, formBuilder: UntypedFormBuilder, private clientService: ClientService, private firmwareService: FirmwareService) {

    this.distanceForm = formBuilder.group({
      distanceInput: ["0.1"],
      feedRate: [500,[Validators.required, Validators.min(1), Validators.max(3000)]]
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
    let command = this.commandService.getJogCommand(axis, direction === Direction.MINUS ? -distance : distance, this.feedRateFc.value);
    this.clientService.sendGetCommand(command).subscribe();
  }

  public home() {
    let command = this.commandService.getCommandUrlByCommand("$H");
    if (command !== null) {
      this.clientService.sendGetCommand(command).subscribe();
    }
  }

  public softhome() {
    let command = this.commandService.getCommandUrlByCommand("G90 X0 Y0");
    if (command !== null) {
      this.clientService.sendGetCommand(command).subscribe();
    }
  }

}
