import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ExecutableCommand } from 'src/app/models/executableCommand';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-laser',
  templateUrl: './laser.component.html',
  styleUrls: ['./laser.component.less']
})
export class LaserComponent implements AfterViewInit, OnDestroy {

  private unsub: Subject<void> = new Subject();
  private laserOn : boolean = false;

  public get LaserOn(){
    return this.laserOn;
  }

  constructor(private commandService: CommandService, private clientService: ClientService, private socketService : SocketService) {
    this.socketService.WsGcodeParserMessage.pipe(takeUntil(this.unsub)).subscribe(message=>{
      this.laserOn = message.ParserIndicatesLaserOn;
    });
  }
  
  ngAfterViewInit(): void {
    let command = this.commandService.getCommandUrlByCommand("$G");
      if(command!= null){
        this.clientService.sendGetCommand(command).subscribe();
      }  
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
  
  public unlock() {
    let command = this.commandService.getCommandUrlByCommand("$X");
    if (command != null) {
      this.clientService.sendGetCommand(command).subscribe();
    }
  }

  public switchLaser(on: boolean) {
    let command: ExecutableCommand | null;
    if (on) {
      command = this.commandService.getCommandUrlByCommand("M3 S25 G1 F1000");
    }
    else {
      command = this.commandService.getCommandUrlByCommand("M5");
    }
    if (command != null) {
      this.clientService.sendGetCommand(command).subscribe();
    }
  }
}
