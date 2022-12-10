import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { FirmwareService } from 'src/app/services/firmware.service';

@Component({
  selector: 'app-grblsheet',
  templateUrl: './grblsheet.component.html',
  styleUrls: ['./grblsheet.component.less']
})
export class GrblsheetComponent implements OnInit, OnDestroy {

  private unsub: Subject<void> = new Subject();

  public get GrblSettings(){
    return this.firmwareService.GrblSettings;
  }

  constructor(private clientService: ClientService, private commandService: CommandService, private firmwareService: FirmwareService){
    
  }
  
  ngOnInit(): void {
    let basecommand = this.commandService.getCommandUrlByCommand("$$");
    if(basecommand != null){
      this.clientService.sendGetCommand(basecommand).subscribe();
    }
  }



  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
