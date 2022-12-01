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

  constructor(private commandService: CommandService, public clientService: ClientService, private snackBar: SnackBarService, private socketService: SocketService, private firmwareService: FirmwareService) {

  }

  ngOnDestroy(): void {
    this.websocketSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    let command = this.commandService.getCommandUrlByType(CommandType.FwInfo);
    if (command != null) {
      this.clientService.sendGetCommand<string>(command).subscribe({
        next: ret => {
          this.firmwareService.FirmwareInfo.parseInfo(ret);
          this.snackBar.showSnackBar("Firmware info fetched, starting websocket connection...");
          this.StartWebSocketConnection();
          this.clientService.Connected.next();
        },
        error: error => {
          this.snackBar.showSnackBar("Firmware info fetch failure!");
        }
      });
    }
  }

  public StartWebSocketConnection() {
    this.socketService.createConnection(this.firmwareService.WebSocketInfo);
     this.websocketSubscription = this.socketService.socketObservable.subscribe({
       next: n => {
         this.snackBar.showSnackBar("websocket connected...");
         this.websocketSubscription.unsubscribe();
       },
       error: e => {
        this.snackBar.showSnackBar("websocket connection failed!");
         this.websocketSubscription.unsubscribe();
       }
     });
  }
}