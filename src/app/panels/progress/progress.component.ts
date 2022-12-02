import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WsState } from 'src/app/models/wsStatusMessage';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.less']
})
export class ProgressComponent implements OnDestroy {

  private unsub: Subject<void> = new Subject();

  public processingFileName: string = '';
  public progress: number = 0;

  public isRunning: boolean = false;
  public isPaused: boolean = false;
  public get pauseResumeText() {
    return this.isPaused ? "Resume" : "Pause";
  }

  constructor(private clientService: ClientService, private commandService: CommandService) {
    this.clientService.WsStatusMessage.pipe(takeUntil(this.unsub)).subscribe(commandResult => {
      if (commandResult.state == WsState.Run) {
        this.isRunning = true;
        let progress = commandResult.infoKeyValues.get("SD");
        if (progress != undefined) {
          let sdMessageParts = progress.split(",");
          this.processingFileName = sdMessageParts[1];
          this.progress = parseFloat(sdMessageParts[0]);
        }
      }
      if (commandResult.state == WsState.Idle) {
        this.isRunning = this.isPaused = false;
        this.progress = 0;
        this.processingFileName = "";
      }
    });
  }

  public pause() {
    let command = this.isPaused?"~":"!";
    let baseCommand = this.commandService.getCommandUrlByCommand(command);
    if (baseCommand != null) {
      this.clientService.sendGetCommand(baseCommand).subscribe(() => {
        this.isPaused = !this.isPaused;
      });
    }
  }

  public cancel() {
    let baseCommand = this.commandService.getCommandUrlByCommand("\u0018");
    if (baseCommand != null) {
      this.clientService.sendGetCommand(baseCommand).subscribe(() => {
        this.isRunning = this.isPaused = false;
      });
    }
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
