import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProcessingDetails } from 'src/app/models/processingDetails';
import { WsState } from 'src/app/models/wsStatusMessage';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.less']
})
export class ProgressComponent implements OnDestroy, OnInit {

  private unsub: Subject<void> = new Subject();
  private processingDetails: ProcessingDetails = new ProcessingDetails("", 0);

  private cancelIssued: boolean = false;

  public get ProcessingDetails(): ProcessingDetails {
    return this.processingDetails;
  }

  public get isRunning() {
    return this.clientService.isRunning && !this.cancelIssued;
  }
  public get pauseResumeText() {
    return this.clientService.MachineState === WsState.Hold ? "Resume" : "Pause";
  }


  constructor(private clientService: ClientService, private commandService: CommandService, private socketService: SocketService, private snackBarService: SnackBarService) {
    this.socketService.WsStatusMessage.pipe(takeUntil(this.unsub)).subscribe(commandResult => {
      switch (commandResult.state) {
        case WsState.Run: {
          this.processingDetails = commandResult.getProcessingDetails();
          break;
        }
        case WsState.Idle: {
          this.processingDetails = new ProcessingDetails("", 0);
          this.cancelIssued = false;
          break;
        }
        case WsState.Alarm: {
          let alarmDesc = commandResult.infoKeyValues.get("alarm");
          this.snackBarService.showSnackBar(alarmDesc ? alarmDesc : "");
          this.cancelIssued = false;
          break;
        }
        case WsState.Hold: {
          if (this.cancelIssued) {
            let holdState = commandResult.infoKeyValues.get("HoldState");
            if (holdState != undefined && holdState == '0') {
              this.finishCancel();
            }
          }
        }
      }
    });
  }
  
  ngOnInit(): void {
    this.cancelIssued = false;
  }

  public pause() {
    let command = this.clientService.MachineState === WsState.Hold ? "~" : "!";
    let baseCommand = this.commandService.getCommandUrlByCommand(command);
    if (baseCommand != null) {
      this.clientService.sendGetCommand(baseCommand).subscribe();
    }
  }

  public cancel() {
    this.cancelIssued = true;
    let baseCommand = this.commandService.getCommandUrlByCommand("!");
    if (baseCommand != null) {
      this.clientService.sendGetCommand(baseCommand).subscribe();
    }
  }

  private finishCancel() {
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
