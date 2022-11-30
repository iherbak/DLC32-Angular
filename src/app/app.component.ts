import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandType } from './models/commandType';
import { ClientService } from './services/client.service';
import { CommandService } from './services/command.service';
import { FirmwareService } from './services/firmware.service';
import { SnackBarService } from './services/snack-bar.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent implements AfterViewInit, OnDestroy {

  title = 'DLC32UI';

  private websocketSubscription!: Subscription;

  constructor(private commandService: CommandService, public clientService: ClientService, private snackBar: SnackBarService, private socketService: SocketService, private firmware: FirmwareService) {

  }

  ngOnDestroy(): void {
    this.websocketSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    let command = this.commandService.getCommandUrlByType(CommandType.FwInfo);
    if (command != null) {
      this.clientService.sendGetCommand(command).subscribe({
        next: ret => {
          this.firmware.FirmwareInfo.parseInfo(ret);
          this.snackBar.showSnackBar("Firmware info fetched, starting websocket connection...");
          this.StartWebSocketConnection();
        },
        error: error => {
          this.firmware.FirmwareInfo.parseInfo('FW version:1.1 (2022010501) # FW target:grbl-embedded  # FW HW:Direct SD  # primary sd:/sd # secondary sd:none # authentication:no # webcommunication: Sync: 81:10.0.4.125 # hostname:grblesp # axis:3\r\n');
          this.snackBar.showSnackBar("Firmware info fetch failure!");
        }
      });
    }
  }

  private StartWebSocketConnection() {
    this.socketService.createConnection("wss://localhost", 4201);
    this.websocketSubscription = this.socketService.socketObservable.subscribe({
      next: n => {
        console.log("Juhuu");
      },
      error: e => {
        console.log("Awwwww");
        this.websocketSubscription.unsubscribe();
      }
    });
  }
}