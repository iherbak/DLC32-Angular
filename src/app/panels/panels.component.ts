import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WsState } from '../models/wsStatusMessage';
import { ClientService } from '../services/client.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.less']
})


export class PanelsComponent implements OnDestroy {

  private unsub: Subject<void> = new Subject()
  private expanded: boolean = true;

  public get isRunning() {
    return this.clientService.isRunning;
  }

  public get isConnected() {
    return this.clientService.isConnected;
  }

  public get isExpanded() {
    return this.expanded;
  }

  constructor(private socketService: SocketService, private clientService: ClientService) {

    this.socketService.WsStatusMessage.pipe(takeUntil(this.unsub)).subscribe({
      next: (commandResult) => {
        switch (commandResult.state) {
          case WsState.Hold:
          case WsState.Run:
          case WsState.Unknown:
          case WsState.Home: {
            this.expanded = false;
            break;
          }
          default: {
            this.expanded = true;
          }
        }
      },
      error: () => {

      }
    })
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
