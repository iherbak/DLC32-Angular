import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Observable, Subject, take, takeUntil, timer } from 'rxjs';
import { CommandType } from './models/commandType';
import { FirmwareInfo } from './models/firmwareInfo';
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
  private textDecoder: TextEncoder = new TextEncoder();

  constructor(private commandService: CommandService, public clientService: ClientService, private snackBar: SnackBarService, private socketService: SocketService, private firmwareService: FirmwareService) {

  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  ngAfterViewInit(): void {
    let command = this.commandService.getEspApiCommand(CommandType.FirmwareInfo);
    if (command != null) {
      this.clientService.sendGetCommand<FirmwareInfo>(command).subscribe({
        next: (ret: FirmwareInfo) => {
          this.firmwareService.FirmwareInfo.clone(ret);
          this.snackBar.showSnackBar("Firmware info fetched, starting websocket connection...");
          this.StartWebSocketConnection();
          this.clientService.Connected.next();
        },
        error: () => {
          this.snackBar.showSnackBar("Firmware info fetch failure!");
        }
      });
    }
  }

  public StartWebSocketConnection() {
    this.snackBar.showSnackBar(this.firmwareService.WebSocketInfo);
    this.socketService.createConnection(this.firmwareService.WebSocketInfo);
    this.socketService.socketObservable.pipe(take(1)).subscribe({
      next: () => {
        this.snackBar.showSnackBar("websocket connected...");
        this.openMainSubscriptions();
      },
      error: () => {
        this.snackBar.showSnackBar("websocket connection failed!");
      }
    });
  }

  private openMainSubscriptions() {
    let baseCommand = this.commandService.getCommandUrlByCommand("?");
    this.watchDog = timer(0, 3000);
    this.watchDog.pipe(takeUntil(this.unsub)).subscribe(() => {
      if (baseCommand != null) {
        this.clientService.sendGetCommand(baseCommand, true, true).subscribe();
      }
    });

    this.socketService.socketObservable.pipe(takeUntil(this.unsub)).subscribe({
      next: () => {
      },
      error: () => {
        this.snackBar.showSnackBar("websocket connection failed!");
      }
    });
  }
}