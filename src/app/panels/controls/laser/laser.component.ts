import { Component } from '@angular/core';
import { ExecutableCommand } from 'src/app/models/executableCommand';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-laser',
  templateUrl: './laser.component.html',
  styleUrls: ['./laser.component.less']
})
export class LaserComponent {

  constructor(private commandService: CommandService, private clientService: ClientService) {

  }

  public unlock() {
    let command = this.commandService.getCommandUrlByCommand("$X");
    if (command != null) {
      this.clientService.sendGetCommand(command).subscribe();
    }
  }

  public switchLaser(on: boolean) {
    let command: ExecutableCommand | null;
    if (on) {
      command = this.commandService.getCommandUrlByCommand("M3", ['S25']);
    }
    else {
      command = this.commandService.getCommandUrlByCommand("M5");
    }
    if (command != null) {
      this.clientService.sendGetCommand(command).subscribe();
    }
  }
}
