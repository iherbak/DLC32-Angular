import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { Command } from 'src/app/models/command';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.less']
})
export class TerminalComponent implements OnDestroy {

  @ViewChild("window") commandWindowElement!: ElementRef;
  @Input() maxLines: number = 200;

  private currentLinesCount: number = 1;
  public commandForm: UntypedFormGroup;

  public get commandInputFc(): FormControl {
    return this.commandForm.get('commandInput') as FormControl;
  }

  public get commandWindowFc(): FormControl {
    return this.commandForm.get('commandWindow') as FormControl;
  }

  public get autoscrollFc(): FormControl {
    return this.commandForm.get('autoscroll') as FormControl;
  }

  public get verboseFc(): FormControl {
    return this.commandForm.get('verbose') as FormControl;
  }

  public filteredOptions: Command[] = [];

  private unsub: Subject<void> = new Subject();

  constructor(formBuilder: UntypedFormBuilder, private commandService: CommandService, private clientService: ClientService, private socketService: SocketService) {
    this.commandForm = formBuilder.group({
      commandInput: [""],
      commandWindow: [{ value: "Terminal is ready...", disabled: true }],
      autoscroll: [true],
      verbose: [false]
    });

    this.commandInputFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe((commandfilter: string) => {
      this.filteredOptions = this.commandService.getCommands().filter(o => o.command.includes(commandfilter));
    });

    this.commandWindowFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe((added: string) => {
      if (this.currentLinesCount++ > this.maxLines) {
        this.currentLinesCount = 1;
        this.commandWindowFc.setValue("Stripped as max lines reached....");
      }
      else {
        if (this.autoscrollFc.value) {
          this.commandWindowElement.nativeElement.scrollTop = this.commandWindowElement.nativeElement.scrollHeight;
        }
      }
    });

    this.commandService.InvalidCommand.pipe(takeUntil(this.unsub)).subscribe(invalidCommand => {
      this.logCommand(invalidCommand);
    });

    this.clientService.CommandSuccess.pipe(takeUntil(this.unsub)).subscribe(commandResult => {
      this.logCommand(commandResult);
    });

    this.clientService.CommandError.pipe(takeUntil(this.unsub)).subscribe(commandResult => {
      this.logCommand(commandResult, true);
    });

    this.socketService.WsStringMessage.pipe(takeUntil(this.unsub)).subscribe(wsStringMsg => {
      this.logCommand(wsStringMsg.rawMessage);
    });

    this.socketService.WsStatusMessage.pipe(takeUntil(this.unsub)).subscribe(wsStatusMsg => {
      if (this.verboseFc.value) {
        this.logCommand(wsStatusMsg.rawMessage);
      }
    });

    this.socketService.WsGcodeParserMessage.pipe(takeUntil(this.unsub)).subscribe(wsGcodeParserMsg => {
      if (this.verboseFc.value) {
        this.logCommand(wsGcodeParserMsg.rawMessage);
      }
    });

  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  public sendCommand() {
    let baseCommand = this.commandService.getCommandUrlByCommand(this.commandInputFc.value);
    if (baseCommand !== null) {
      this.clientService.sendGetCommand(baseCommand).subscribe(n => {
        this.logCommand(JSON.stringify(n));
      });
    }
  }

  public hasCommand() {
    return this.commandInputFc.value === '' || this.commandInputFc.value === null;
  }

  private logCommand(command: string, isError: boolean = false) {
    if (isError) {
      this.commandWindowFc.setValue(`${this.commandWindowFc.value} \n "Error" ${command.replace('\r\n', '')}`);
    }
    else {
      this.commandWindowFc.setValue(`${this.commandWindowFc.value} \n ${command.replace('\r\n', '')}`);
    }
  }

  public history($event: Event) {
    console.log($event);
  }
}
