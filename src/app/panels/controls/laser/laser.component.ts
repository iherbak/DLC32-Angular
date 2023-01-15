import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  private laserOn: boolean = false;

  public laserForm: FormGroup;

  public get powerRateFc() {
    return this.laserForm.get('powerRate') as FormControl;
  }

  public get LaserOn() {
    return this.laserOn;
  }

  constructor(private commandService: CommandService, private clientService: ClientService, private socketService: SocketService, private formBuilder: FormBuilder) {

    this.laserForm = formBuilder.group({
      powerRate: [10, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.socketService.WsGcodeParserMessage.pipe(takeUntil(this.unsub)).subscribe(message => {
      this.laserOn = message.ParserIndicatesLaserOn;
    });
  }

  ngAfterViewInit(): void {
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
      command = this.commandService.getCommandUrlByCommand(`M3 S${(this.powerRateFc.value / 100) * 1000} G1 F1000`);
    }
    else {
      command = this.commandService.getCommandUrlByCommand("M5");
    }
    if (command != null) {
      this.clientService.sendGetCommand(command).subscribe(() => {
        this.checkGcodeParserState();
      });
    }
  }

  private checkGcodeParserState() {
    let command = this.commandService.getCommandUrlByCommand("$G");
    if (command != null) {
      this.clientService.sendGetCommand(command).subscribe();
    }
  }
}
