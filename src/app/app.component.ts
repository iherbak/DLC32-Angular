import { AfterViewInit, Component } from '@angular/core';
import { CommandType } from './models/commandType';
import { ClientService } from './services/client.service';
import { CommandService } from './services/command.service';
import { SnackBarService } from './services/snack-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent implements AfterViewInit {
  title = 'DLC32UI';

  constructor(private commandService: CommandService, public clientService: ClientService, private snackBar: SnackBarService) {
  }

  ngAfterViewInit(): void {
    let command = this.commandService.getCommandUrlByType(CommandType.FwInfo);
    this.clientService.sendCommand(command).subscribe({
      next: ret => {
        this.snackBar.showSnackBar("Connected successfully");
      },
      error: error => {
        this.snackBar.showSnackBar("Unable to connect");
      }
    });
  }
}