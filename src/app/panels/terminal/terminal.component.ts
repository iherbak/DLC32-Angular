import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Command } from 'src/app/models/command';
import { CommandType } from 'src/app/models/commandType';
import { ExecutableCommand } from 'src/app/models/executableCommand';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.less']
})
export class TerminalComponent implements OnDestroy {

  @ViewChild("window") commandWindowElement!: ElementRef;
  @Input() maxLines: number = 100;

  private currentLinesCount: number = 1;
  public commandForm: UntypedFormGroup;

  public get commandInputFc(): FormControl {
    return this.commandForm.get('commandInput') as FormControl;
  }

  public get commandWindowFc(): FormControl {
    return this.commandForm.get('commandWindow') as FormControl;
  }


  public filteredOptions: Command[] = [];

  private unsub: Subject<void> = new Subject();

  constructor(formBuilder: UntypedFormBuilder, private commandService: CommandService, private clientService: ClientService) {
    this.commandForm = formBuilder.group({
      commandInput: [""],
      commandWindow: [{ value: "Terminal is ready", disabled: true }]
    });

    this.commandInputFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe(commandfilter => {
      this.filteredOptions = this.commandService.getCommands().filter(o => o.command.includes(commandfilter));
    });

    this.commandWindowFc.valueChanges.pipe(takeUntil(this.unsub)).subscribe((added: string) => {
      if (this.currentLinesCount++ > this.maxLines) {
        this.currentLinesCount = 1;
        this.commandWindowFc.setValue("Stripped as max lines reached....");
      }
      else {
        this.commandWindowElement.nativeElement.scrollTop = this.commandWindowElement.nativeElement.scrollHeight;
      }
    });

    this.commandService.InvalidCommand.pipe(takeUntil(this.unsub)).subscribe(invalidCommand => {
      this.logCommand(invalidCommand);
    });

    this.clientService.CommandSuccess.pipe(takeUntil(this.unsub)).subscribe(commandResult => {
      this.logCommand(commandResult);
    });

    this.clientService.CommandError.pipe(takeUntil(this.unsub)).subscribe(commandResult => {
      this.logCommand(commandResult);
    });

  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  public sendCommand() {
    let baseCommand = this.commandService.getCommandUrlByCommand(this.commandInputFc.value);
    if (baseCommand !== null) {
      this.clientService.sendCommand(baseCommand);
    }
  }

  public hasCommand() {
    return this.commandInputFc.value === '' || this.commandInputFc.value === null;
  }

  private logCommand(command: string) {
    this.commandWindowFc.setValue(this.commandWindowFc.value + "\n" + command);
  }
}
