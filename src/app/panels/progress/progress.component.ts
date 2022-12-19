import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProcessingDetails } from 'src/app/models/processingDetails';
import { WsState } from 'src/app/models/wsStatusMessage';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.less']
})
export class ProgressComponent implements OnDestroy {

  private unsub: Subject<void> = new Subject();
  private processingDetails: ProcessingDetails = new ProcessingDetails("", 0);

  public get ProcessingDetails(): ProcessingDetails {
    return this.processingDetails;
  }

  public get FormattedPercentage(): string {
    if (this.ProcessingDetails.Percentage != 0) {
      return `${this.ProcessingDetails.Percentage} %`;
    }
    return "";
  }

  public get isRunning() {
    return this.socketService.isRunning;
  }
  public get pauseResumeText() {
    return this.socketService.MachineState === WsState.Hold ? "Resume" : "Pause";
  }

  constructor(private clientService: ClientService, private commandService: CommandService, private socketService: SocketService) {
    this.clientService.WsStatusMessage.pipe(takeUntil(this.unsub)).subscribe(commandResult => {
      if (commandResult.state == WsState.Run) {
        this.processingDetails = commandResult.getProcessingDetails();
      }
      if (commandResult.state == WsState.Idle) {
        this.processingDetails = new ProcessingDetails("", 0);
      }
    });
  }

  public pause() {
    let command = this.socketService.MachineState === WsState.Hold ? "~" : "!";
    let baseCommand = this.commandService.getCommandUrlByCommand(command);
    if (baseCommand != null) {
      this.clientService.sendGetCommand(baseCommand).subscribe();
    }
  }

  public cancel() {
    let baseCommand = this.commandService.getCommandUrlByCommand("\u0018");
    if (baseCommand != null) {
      this.clientService.sendGetCommand(baseCommand).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
