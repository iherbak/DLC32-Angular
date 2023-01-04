import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Observable, Subject, take, takeUntil, timer } from 'rxjs';
import { CommandType } from './models/commandType';
import { FirmwareInfo } from './models/firmwareInfo';
import { WsStatusMessage } from './models/wsStatusMessage';
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
          this.firmwareService.fetchGrblSettings().subscribe(() => {
            this.firmwareService.fetchEspSettings().subscribe(() => {
              this.StartWebSocketConnection();
              this.clientService.Connected.next();
            });
          });
        },
        error: () => {
          let wsMessage = new WsStatusMessage("<State:Unknown>");
          this.socketService.WsStatusMessage.next(wsMessage);
          this.snackBar.showSnackBar("Firmware info fetch failure!");
        }
      });
    }
  }

  public StartWebSocketConnection() {
    this.snackBar.showSnackBar(this.firmwareService.WebSocketInfo);
    this.socketService.createConnection(this.firmwareService.WebSocketInfo);
    this.openMainSubscriptions();
  }

  private openMainSubscriptions() {

    this.socketService.socketObservable.pipe(takeUntil(this.unsub)).subscribe({
      next: () => {
      },
      error: () => {
        this.snackBar.showSnackBar("websocket connection failed!");
      }
    });

    let baseCommand = this.commandService.getCommandUrlByCommand("?");
    this.watchDog = timer(0, 3000);

    this.watchDog.pipe(takeUntil(this.unsub)).subscribe(() => {
      if (baseCommand != null) {
        this.clientService.sendGetCommand(baseCommand, true, true).subscribe();
      }
    });

  }
}