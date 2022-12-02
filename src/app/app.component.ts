import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription, take, takeUntil, timer } from 'rxjs';
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

  private unsub: Subject<void> = new Subject();
  private watchDog!: Observable<number>;

  constructor(private commandService: CommandService, public clientService: ClientService, private snackBar: SnackBarService, private socketService: SocketService, private firmwareService: FirmwareService) {

  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
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
          let ret = "FW version:1.1 (2022010501) # FW target:grbl-embedded  # FW HW:Direct SD  # primary sd:/sd # secondary sd:none # authentication:no # webcommunication: Sync: 81:10.0.4.112 # hostname:grblesp # axis:3";
          this.firmwareService.FirmwareInfo.parseInfo(ret);
          this.snackBar.showSnackBar("Firmware info fetch failure!");
        }
      });
    }
  }

  public StartWebSocketConnection() {
    this.socketService.createConnection(this.firmwareService.WebSocketInfo);
    this.socketService.socketObservable.pipe(take(1)).subscribe({
      next: n => {
        this.snackBar.showSnackBar("websocket connected...");
        this.openMainSubscriptions();
      },
      error: e => {
        this.snackBar.showSnackBar("websocket connection failed!");
      }
    });
  }

  private openMainSubscriptions() {
    let baseCommand = this.commandService.getCommandUrlByCommand("?");
    this.watchDog = timer(0, 3000);
    this.watchDog.pipe(takeUntil(this.unsub)).subscribe(() => {
      if (baseCommand != null) {
        this.clientService.sendGetCommand(baseCommand,true).subscribe();
      }
    });

    this.socketService.socketObservable.pipe(takeUntil(this.unsub)).subscribe({
      next: n => {
      },
      error: e => {
        this.snackBar.showSnackBar("websocket connection failed!");
      }
    });
  }
}